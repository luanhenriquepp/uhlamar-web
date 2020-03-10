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
                  v-model="filterProductName"
                  append-icon="search"
                  label="Nome do Produto"
                  multi-line
                  hide-details/>
              </v-flex>

              <v-flex xs4>
                <v-text-field
                  v-model="filterBuyerName"
                  append-icon="search"
                  label="Nome do Comprador"
                  multi-line
                  hide-details/>

              </v-flex>
              <v-flex xs4>
                <v-text-field
                  v-model="filterCoupon"
                  append-icon="search"
                  label="Cupon"
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
                        md4>
                        <v-text-field
                          v-model="editedItem.product_name"
                          label="Produto"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          v-model="editedItem.buyer_name"
                          label="Comprador"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          v-model="editedItem.discount_coupon"
                          label="Cupon"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          v-model="editedItem.quantity"
                          label="Quantidade"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          v-model="editedItem.price"
                          label="Preço"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          v-model="editedItem.color"
                          label="Cor"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-select
                          :items="sizes"
                          label="Tamanho"
                          v-model="editedItem.size"
                          item-text="description"
                          item-value="key">
                        </v-select>

                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
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

              <!-- change table header background and text color(or other properties) -->
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
                  {{ props.item.product_name }}
                </td>
                <td>
                  {{ props.item.buyer_name }}
                </td>
                <td>
                  R$ {{ props.item.price }}
                </td>
                <td>
                  {{ props.item.quantity }}
                </td>
                <td>
                  R$ {{ props.item.total_sale }}
                </td>
                <td>
                  {{ props.item.discount_coupon }}
                </td>

                <td>
                  {{ props.item.color }}
                </td>
                <td>
                  {{ checkSize(props.item.size) }}
                </td>
                <td>
                  {{ props.item.dt_sale | friendlyDate }}
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
                color="general"
                v-model="currentPage"
                :length="pagination.last_page"/>
            </div>
          </material-card>
        </div>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
  import moment from 'moment'

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
      filterProductName: '',
      filterBuyerName: '',
      filterCoupon: '',
      snackText: '',
      currentPage: 1,
      sizes: [
        {key: 'P', description: 'Pequeno'},
        {key: 'M', description: 'Médio'},
        {key: 'G', description: 'Grande'},
        {key: 'U', description: 'Único'},
      ],
      max25chars: v => v.length <= 25 || 'Input too long!',
      pagination: {},
      data: '',
      checkboxAdmin: true,
      checkboxActive: true,
      rowsAmount: [10, 15, 20, {'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1}],
      dialog: false,
      search: '',
      headers: [
        {text: 'Produto', value: 'product_name'},
        {text: 'Comprador', value: 'buyer_name'},
        {text: 'Preço', value: 'price'},
        {text: 'Qnt', value: 'quantity'},
        {text: 'Total', value: 'total_sale'},
        {text: 'Cupon', value: 'discount_coupon'},
        {text: 'Cor', value: 'color'},
        {text: 'Tamanho', value: 'size'},
        {text: 'Data', value: 'dt_sale'},
        {text: 'Ações', value: 'actions', sortable: false}

      ],
      editedIndex: -1,
      editedItem: {
        user_id: '',
        buyer_name: '',
        discount_coupon: '',
        dt_sale: '',
        size: '',
        product_name: '',
        color: '',
        price: '',
        quantity: '',
        total_sale: '',
        observation: ''
      },
      defaultItem: {}
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Nova Venda' : 'Editar vENDA'
      }
    },

    watch: {
      dialog(val) {
        val || this.close()
      }
    },
    watch: {
      currentPage: function (val) {
        this.getSale('?page=' + val)
      },
      filterProductName: function (filter) {
        this.getSale('?search=product_name:' + filter)
      },
      filterBuyerName: function (filter) {
        this.getSale('?search=buyer_name:' + filter)
      },
      filterCoupon: function (filter) {
        this.getSale('?search=discount_coupon:' + filter)
      }
    },
    mounted() {
      return this.getSale();
    },

    methods: {

      getSale(filter = '') {
        this.$http.get('/sale' + filter)
          .then(response => {
            this.pagination = response.data.data;
            this.data = response.data.data.data;
          })
          .catch(error => console.log(error))
      },

      editItem(item, dbox = true) {
        this.editedIndex = this.data.indexOf(item);
        item.isAdmin = this.checkboxAdmin;
        item.isActive = this.checkboxActive;
        this.editedItem = Object.assign({}, item);
        this.dialog = dbox
      },

      checkSize(value) {
        switch (value) {
          case 'P':
            return 'Pequeno';
          case 'M':
            return 'Médio';
          case 'G':
            return 'Grande';
          default:
            return 'Único'
        }
      },

      callTableAction(item, endpoint, method) {
        let tableItem = this.editedItem;
        this.$store.dispatch('updateTableItem', {endpoint, tableItem, method})
          .then((response) => this.saveInline(response.data))
          .catch(error => {
            console.log(error);
            return this.cancelInline
          })
      },

      deleteItem(item) {
        const index = this.data.indexOf(item);
        confirm('Are you sure you want to delete this item?') && this.data.splice(index, 1);
        this.editedItem = Object.assign({}, item);
        let endpoint = `sale/${this.editedItem.sale_id}`;
        let method = 'DELETE';
        this.callTableAction(item, endpoint, method);
        this.getSale()
      },

      close() {
        this.dialog = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1
        }, 300)
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.data[this.editedIndex], this.editedItem);
          let tableItem = this.editedItem;
          let endpoint = `sale/${this.editedItem.sale_id}`;
          let method = 'put';
          this.$store.dispatch('updateTableItem', {endpoint, tableItem, method})
            .then((response) => {
              console.log(response);
              this.saveInline(response.data);
              this.getSale()
            })
            .catch(error => {
              console.log(error);
              return this.cancelInline
            })
        } else {
          let tableItem = this.editedItem;
          this.data.push(this.editedItem);
          let endpoint = `sale/`;
          let method = 'post';
          this.$store.dispatch('updateTableItem', {endpoint, tableItem, method})
            .then((response) => {
              this.saveInline(response.data);
              this.getSale()
            })
            .catch(error => {
              this.getSale();
              console.log(error);
              return this.cancelInline
            })
        }
        this.close()
      },
      saveInline(data) {
        this.snack = true;
        this.snackColor = 'success';
        this.snackText = data.message
      },
      cancelInline() {
        this.snack = true;
        this.snackColor = 'error';
        this.snackText = 'Canceled'
      },
      reset() {
        this.snack = true;
        this.snackColor = 'success';
        this.snackText = 'Data reset to default'
      },
      openInline() {
        this.snack = true;
        this.snackColor = 'info';
        this.snackText = 'Dialog opened'
      },
      closeInline() {
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
