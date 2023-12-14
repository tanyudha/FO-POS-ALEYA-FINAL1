import { TransactionType } from '@/types/transaction'
import * as TimeUtil from '@/utils/time'
import * as CurrencyUtil from '@/utils/currency'
import { displayId, displayTransactionMethod } from '@/utils/textUtil'
import { getTotalPrice } from '@/utils/transaction'

interface iItemTable {
  qty: number
  nama: string
  total: string
}

const TITLE_BON = `<div class="title">
    Aleya Frozen Food Grosir
  </div>`

const KOP_BON = `
<div class="kop">
<p class="kop-black">+62 812 8433 3304</p>
<p>Bukit bogor raya blok I 12A No 166, Kota Bogor, Kecamatan Bogor Utara<br>Kota Bogor, Jawa Barat, 16155</p>
</div>`

const LINE = `<hr class="line">`

const TABLE_HEADER = `<tr class="item-title-row">
  <th class="left">Qty</th>
  <th class="left">Nama</th>
  <th class="right">Total</th>
</tr>`

const createRow = (title: string, data: string = '') => `<div class="bon-row">
  <p class="bon-row-title">${title}</p>
  <p class="bon-row-data">${data}</p>
</div>`

const createTotalRow = (total: string | number) => `<div class="total">
  <p>Total</p>
  <p>${CurrencyUtil.format(+total)}</p>
</div>
`

const createItemTable = (data: Array<iItemTable>) => {
  const res = data.map(
    (row: any) => `<tr class="item-row">
  <td class="left">${row.qty}</td>
  <td class="left item-name">${row.nama}</td>
  <td class="right">${row.total}</td>
  </tr>`
  )
  return `<table>
    ${TABLE_HEADER}
    ${res.join('')}
  </table>`
}

const style = (height: number) => `
<style>
* {
  box-sizing: border-box;
}
body {
  font-family : 'Roboto', 'Arial', 'sans-serif';
  color : #000000;
  font-weight : 400;
  font-size : 11px;
  width: 58mm;
}
table{
  width : 100%;
  font-size : 11px;
}
table td, table td * {
  vertical-align: top;
}
.item-name {
  line-break: anywhere;
}
.container{
  padding: 12px 2mm 0;
  display: inline-block;
  font-size : 10px;
  width: 52mm;
}
hr{
  width : 100%;
  margin: 8px 0;
  border-top: 0.25px solid #ebebeb;
  height: 0;
}
.title, .kop{
  text-align : center;
}
.title{
  font-size : 14px;
  font-weight: 700;
}
.kop{
  color : #737373;
  font-size : 11px;
  line-height: 1.25;
}
.kop.kop-black{
  color : #000000;
}
.bon-row, .total{
  line-height: 0;
  width : 100%;
  display : flex;
  flex-direction : row;
  justify-content : space-between;
}
.bon-row-title, .bon-row-data{
  color : #000000;
}
.bon-row-title, th, .total{
  font-weight : 600;
}
.bon-row-data, .right{
  text-align : right;
}
.left{
  text-align : left;
}
.item-title-row {
  height: 18px;
}
.item-row {
  height: 16px;
  display
}
.total p{
  color : #2196F3;
  font-size : 14px;
}
@page {
  size: 58mm ${height}mm;
  margin: 0cm;
}
</style>
`

export const printTransaction = (transaction: TransactionType) => {
  const bon = window.open('', '_blank', 'fullscreen=yes,')
  if (!bon) return

  bon.document.write('<html>')
  bon.document.write('<title>Cetak Transaksi</title>')
  bon.document.write('<body>')
  bon.document.write('<div class="container">')
  bon.document.write(TITLE_BON)
  bon.document.write(LINE)
  bon.document.write(KOP_BON)
  bon.document.write(LINE)
  bon.document.write(
    createRow('Kode Transaksi', displayId(transaction.id as string))
  )
  bon.document.write(
    createRow(
      'Tanggal',
      TimeUtil.format(new Date(transaction.createdAt as string).toString())
    )
  )
  bon.document.write(createRow('Nama Pembeli', transaction.customer.name))
  bon.document.write(
    createRow('Nomor Telepon', transaction.customer.phone.toString())
  )
  bon.document.write(createRow('Nama Pegawai', transaction.employee.name))
  bon.document.write(createRow('Nama Kasir', transaction.cashier.name))
  bon.document.write(
    createRow(
      'Pembayaran',
      displayTransactionMethod(
        transaction.transaction_method,
        !!transaction.invoice_id
      )
    )
  )
  bon.document.write(LINE)
  bon.document.write(
    createItemTable(
      transaction.details.map((el: any) => ({
        qty: el.qty,
        nama: el.item.name,
        total: CurrencyUtil.format(el.price_final),
      }))
    )
  )
  bon.document.write(LINE)
  bon.document.write(createTotalRow(getTotalPrice(transaction)))
  bon.document.write('</div>')
  const height = bon.document.querySelector('.container')?.clientHeight || 0
  // 0.08 = px to mm ratio, based on experiments
  bon.document.write(style(height * 0.08))
  bon.document.write('</body>')
  bon.document.write('</html>')
  bon.document.close()
  bon.print()
  // closes window after printing (including cancellation)
  // setTimeout(() => {
  //   bon.close()
  // }, 100)
}
