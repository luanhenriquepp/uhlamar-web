<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-layout
      justify-center
      wrap
    >
      <v-flex
        md12
      >
        <div>
          <material-card
            color="general"
            title="Vendas"
          >
            <v-spacer/>
            <v-layout>
              <v-flex xs4>
                <v-text-field
                        v-model="filter.buyer_name"
                        append-icon="search"
                        label="Nome do Comprador"
                        multi-line
                        hide-details/>

              </v-flex>

              <v-flex xs4>
                <v-text-field
                  v-model="filter.stock.product_name"
                  append-icon="search"
                  label="Nome do Produto"
                  multi-line
                  hide-details/>
              </v-flex>


                            <v-flex xs4>
                              <v-text-field
                                v-model="filter.coupon.coupon_name"
                                append-icon="search"
                                label="Cupom"
                                multi-line
                                hide-details/>
                            </v-flex>
            </v-layout>

            <v-dialog
              v-model="dialog"
              max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn
                  color="general"
                  dark
                  class="mb-2"
                  v-on="on">Nova Venda
                </v-btn>
              </template>

              <v-card>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex
                        xs12
                        sm6
                        md6>
                        <v-text-field
                          v-model="editedItem.buyer_name"
                          label="Comprador"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm4
                        md6>
                        <v-select
                          :items="couponItems"
                          v-model="editedItem.coupon_id"
                          :clearable="true"
                          :item-text="couponText"
                          label="Cupom"
                          item-value="coupon_id"/>
                      </v-flex>
                      <v-flex
                        xs8
                        sm4
                        md4>
                        <v-text-field
                          v-model="editedItem.quantity"
                          label="Quantidade"/>
                      </v-flex>

                      <v-flex
                        xs16
                        sm12
                        md8>
                        <v-select
                          :items="itemFromStock"
                          v-model="editedItem.stock_id"
                          :item-text="text"
                          label="Produto"
                          item-value="stock_id"/>
                      </v-flex>
                      <v-flex
                        xs14
                        sm6
                        md6>
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          :return-value.sync="editedItem.dt_sale"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="editedItem.dt_sale"
                              label="Selecionar Data"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            />
                          </template>
                          <v-date-picker
                            v-model="editedItem.dt_sale"
                            no-title
                            scrollable>
                            <v-spacer/>
                            <v-btn
                              text
                              color="primary"
                              @click="menu = false">Cancel
                            </v-btn>
                            <v-btn
                              text
                              color="primary"
                              @click="$refs.menu.save(editedItem.dt_sale)">OK
                            </v-btn>
                          </v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    color="blue darken-1"
                    flat
                    @click="close">Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    flat
                    @click="save">Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-data-table
              :headers="headers"
              :items="data"
              :loading="loading"
              :search="search"
              :items-per-page="pagination.per_page"
              :server-items-length="pagination.total"
              class="elevation-1"
              hide-actions
            >

              <template
                slot="headerCell"
                slot-scope="{ header }"
              >
                <span
                  class="subheading font-weight-light text-general text--darken-3"
                  v-text="header.text"
                />
              </template>
              <template v-slot:items="props">
                <td>
                  <div>
                    {{ props.item.stock ? props.item.stock.product_name : '' }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ props.item.buyer_name }}
                  </div>
                </td>
                <td>
                  <div>
                    R$ {{ props.item.stock ? props.item.stock.price : '' }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ props.item.quantity }}
                  </div>
                </td>
                <td>
                  <div>
                    R$ {{ props.item.total_sale }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ props.item.coupon ? props.item.coupon.coupon_name : '' }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ props.item.stock ? props.item.stock.color : '' }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ checkSize(props.item.stock ? props.item.stock.size : '') }}
                  </div>
                </td>
                <td>
                  <div>
                    {{ props.item.dt_sale | friendlyDate }}
                  </div>
                </td>
                <td class="justify-center ">
                  <v-icon
                    small
                    class="mr-1"
                    @click="editItem(props.item)">edit
                  </v-icon>
                  <v-icon
                    small
                    @click="deleteItem(props.item)">delete
                  </v-icon>
                </td>
              </template>
              <v-snackbar
                v-model="snack"
                :timeout="3000"
                :color="snackColor">
                {{ snackText }}
                <v-btn
                  flat
                  @click="snack = false">Close
                </v-btn>
              </v-snackbar>
            </v-data-table>
            <div class="text-xs-center">
              <v-pagination
                v-if="pagination.total > pagination.per_page"
                v-model="currentPage"
                :length="pagination.last_page"
                color="general"/>
            </div>
          </material-card>
        </div>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
  import moment from 'moment'
  import _ from 'lodash'

  export default {
    filters: {
      friendlyDate: function (date) {
        return moment(date).format('D/MM/YYYY')
      }
    },
    data: () => ({
      loading: true,
      snack: false,
      snackColor: '',
      moment: moment,
      menu: false,
      modal: false,
      filter: {
        stock: {
          product_name: ''
        },
        coupon: {
          coupon_name: ''
        }
      },
      snackText: '',
      currentPage: 1,
      sizes: [
        { key: 'P', description: 'Pequeno' },
        { key: 'M', description: 'Médio' },
        { key: 'G', description: 'Grande' },
        { key: 'U', description: 'Único' }
      ],
      max25chars: v => v.length <= 25 || 'Input too long!',
      pagination: {},
      data: [],
      dialog: false,
      search: '',
      headers: [
        { text: 'Produto', value: 'product_name', sortable: false },
        { text: 'Comprador', value: 'buyer_name', sortable: false },
        { text: 'Preço', value: 'price', sortable: false },
        { text: 'Qnt', value: 'quantity', sortable: false },
        { text: 'Total', value: 'total_sale', sortable: false },
        { text: 'Cupom', value: 'coupon_name', sortable: false },
        { text: 'Cor', value: 'color', sortable: false },
        { text: 'Tamanho', value: 'size', sortable: false },
        { text: 'Data', value: 'dt_sale', sortable: false },
        { text: 'Ações', value: 'actions', sortable: false }

      ],
      itemFromStock: [],
      couponItems: [],
      editedIndex: -1,
      editedItem: {
        user_id: '',
        stock_id: '',
        buyer_name: '',
        dt_sale: '',
        quantity: '',
        total_sale: '',
        sale_id: '',
        coupon_id: ''
      },
      defaultItem: {}
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nova Venda' : 'Editar Venda'
      }
    },

    watch: {
      filter: {
        handler: _.debounce(function (val) {
          if (val) {
            console.log('valor entrando na funcao', JSON.stringify(val))
            const filterData = this.removeEmpty(val)
            console.log('valor depois do removeempety', JSON.stringify(filterData))

            const newFilter = JSON.stringify(filterData).replace(/"/g, '')
              .replace('"{', '')
              .replace('}"', '')
              .replace(/,/g, ';')
              .replace('}"', '')
              .replace(':{', '')
              .replace('{', '')
              .replace('}', ';')
              .replace(/product_name/g, '')
              .replace(/coupon_name/g, '')
              .replace(/stock/g, 'stock.product_name')
              .replace(/coupon/g, 'coupon.coupon_name')
              .replace(';}', '')
              .replace('}', '')
              .replace(';;', ';')
              .replace(':{;', ';')
              .replace('stock.product_name;', '')
              .replace('coupon.coupon_name;', '')
              .replace('}', '')
              .replace('{:', '')
              .replace(';&', '')
              .replace('coupon.coupon_name:{', '')
            return this.getSale('?search=' + newFilter + '&searchJoin=and')
          }
        }, 500),
        deep: true
      },
      currentPage: function (val) {
        this.getSale('?page=' + val)
      }
    },
    mounted () {
       this.getSale()
       this.getStock()
       this.getCoupon()
    },

    methods: {
      removeEmpty (obj) {
        Object.entries(obj).forEach(([key, val]) => {
          if (val && typeof val === 'object') {
            this.removeEmpty(val)
          } else if (val == null || !val) {
            delete obj[key]
          }
        })
        return obj
      },
      text: item => item.product_name + ' — ' + item.color,
      couponText: item => item.coupon_name + ' — ' + item.percentage + '%',

      getCoupon (filter = '') {
        this.$http.get('/coupon' + filter)
          .then(response => {
            this.couponItems = response.data.data.data
          })
          .catch(error => console.log(error))
      },
      getStock (filter = '') {
        this.$http.get('/available-stock' + filter)
          .then(response => {
            this.itemFromStock = response.data.data
          })
          .catch(error => console.log(error))
      },
      getSale (filter = '') {
        this.$http.get('/sale' + filter)
          .then(response => {
            this.pagination = response.data.data
            this.data = response.data.data.data
          })
          .catch(error => console.log(error))
      },
      editItem (item, dbox = true) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = dbox
      },
      checkSize (value) {
        switch (value) {
          case 'P':
            return 'Pequeno'
          case 'M':
            return 'Médio'
          case 'G':
            return 'Grande'
          default:
            return 'Único'
        }
      },
      async deleteItem (item) {
        confirm('Are you sure you want to delete this item?')
        let endpoint = `sale/${item.sale_id}`
        let method = 'DELETE'
         await this.$store.dispatch('deleteTableItem', { endpoint, method })
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
           .finally(() => {
            this.getSale()
        })
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.data[this.editedIndex], this.editedItem)
          let tableItem = this.editedItem
          let endpoint = `sale/${this.editedItem.sale_id}`
          let method = 'put'
          this.$store.dispatch('updateTableItem', { endpoint, tableItem, method })
            .then((response) => {
              console.log(response)
            }).catch(error => {
              console.log(error)
            }).finally(() => {
              return this.getSale()
            })
        } else {
          const user = localStorage.getItem('user')
          this.editedItem.user_id = user
          let tableItem = this.editedItem
          this.data.push(this.editedItem)
          let endpoint = `sale`
          let method = 'post'
          this.$store.dispatch('updateTableItem', { endpoint, tableItem, method })
            .then((response) => {
              console.log(response)
            })
            .catch(error => {
              console.log(error)
            }).finally(() => {
              return this.getSale()
          })
        }
        this.close()
      },
      saveInline (data) {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = data.message
      },
      cancelInline () {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'Canceled'
      },
      reset () {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Data reset to default'
      },
      openInline () {
        this.snack = true
        this.snackColor = 'info'
        this.snackText = 'Dialog opened'
      },
      closeInline () {
        console.log('Dialog closed')
      }
    }
  }
</script>

<style>
  table.v-table thead tr {
    color: red !important;
  }

  table.v-table tbody td:not(:first-child) {
    padding: 0 25px !important;

  }

  table.v-table tbody td:first-child {
    padding: 0 0px !important;
  }

  table.v-table thead tr th span {
    font-size: 15px !important;
  }

  tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
  }

  table.v-table thead th:not(:first-child) {
    padding: 0 2px !important;
  }

  table.v-table thead th:not(:first-child) {
    padding: 0 10px !important;
  }

  table.v-table tbody td {
    font-size: 12px !important;
    font-weight: 300;
  }
  table.v-table tbody td:first-child,
  table.v-table tbody td:not(:first-child),
  table.v-table tbody th:first-child,
  table.v-table tbody th:not(:first-child),
  table.v-table thead td:first-child,
  table.v-table thead td:not(:first-child),
  table.v-table thead th:first-child,
  table.v-table thead th:not(:first-child) {
    padding: 0 10px !important;
  }
</style>
