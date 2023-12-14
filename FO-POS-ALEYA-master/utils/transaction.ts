import {
  TransactionType,
  TransactionDetailType,
  ItemType,
  DiscountType,
} from '@/types/transaction'

export const getTotalPrice = (transaction: TransactionType): number => {
  if (!transaction.details?.length) return 0
  if (transaction.details.length === 1)
    return transaction.details[0].price_final
  else {
    let amount = 0
    transaction.details.forEach((detail) => {
      amount += detail.price_final
    })
    return amount
  }
}

export const convertTransaction = (transaction: any): TransactionType => {
  const details: TransactionDetailType[] = []
  transaction.transaction_details?.forEach((detail: any) => {
    const item: ItemType = {
      id: detail.item_id,
      name: detail.item.name,
      stock: +detail.item.stock,
      price_retail: +detail.item.price_retail,
      price_wholesale: +detail.item.price_wholesale,
      description: detail.item.description,
    }
    const discounts: DiscountType[] = []
    detail.discounts?.forEach((discount: any) => {
      discounts.push({
        id: discount.id,
        name: discount.name,
        is_percentage: discount.is_percentage,
        amount: +discount.amount,
        percentage: +discount.percentage,
        is_active: discount.is_active,
      })
    })
    details.push({
      id: detail.id,
      qty: +detail.qty,
      price: +detail.price,
      price_sum: +detail.price_sum,
      price_final: +detail.price_final,
      price_type: detail.price_type,
      createdAt: detail.createdAt,
      item,
      discounts,
    })
  })
  return {
    id: transaction.id,
    customer: {
      id: transaction.customer_id,
      name: transaction.customer_name,
      phone: transaction.customer_phone,
    },
    cashier: {
      id: transaction.cashier_id,
      name: transaction.cashier_name,
    },
    employee: {
      id: transaction.employee_id,
      name: transaction.employee_name,
    },
    createdAt: transaction.createdAt,
    transaction_method: transaction.transaction_method,
    details,
  }
}
