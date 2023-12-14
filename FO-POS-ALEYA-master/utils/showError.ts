import Vue from 'vue'

const showError = (error: any) => {
  Vue.toasted.show(error)
}

export default showError
