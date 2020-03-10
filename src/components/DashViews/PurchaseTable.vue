<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex md12>
        <div>
          <material-card
            color="general"
            title="Compras">
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
                  v-model="filterProviderName"
                  append-icon="search"
                  label="Nome do Fornecedor"
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
                  v-on="on">Nova compra
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
                          v-model="editedItem.provider_name"
                          label="Fornecedor"/>
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
                        <v-text-field
                          v-model="editedItem.quantity"
                          label="Quantidade"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-select
                          :items="sizes"
                          v-model="editedItem.size"
                          label="Tamanho"
                          item-text="description"
                          item-value="key">
                        </v-select>

                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          prefix="R$"
                          v-model="editedItem.price"
                          label="Preço"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md6>
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          :return-value.sync="editedItem.dt_purchase"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="editedItem.dt_purchase"
                              label="Selecionar Data"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            />
                          </template>
                          <v-date-picker
                            v-model="editedItem.dt_purchase"
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
                              @click="$refs.menu.save(editedItem.dt_purchase)">OK
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
              :items-per-page="pagination.per_page"
              :server-items-length="pagination.total"
              class="elevation-2"
              hide-actions
            >
              <template slot="headerCell" slot-scope="{ header }">
                <span
                  class="font-weight-light text-general text--darken-2"
                  v-text="header.text"
                />
              </template>
              <template v-slot:items="props">

                <td>
                  <div>{{ props.item.product_name }}</div>
                </td>
                <td>
                  <div>{{ props.item.provider_name }}</div>
                </td>
                <td>
                  <div>R$ {{ props.item.price }}</div>
                </td>
                <td>
                  <div>{{ props.item.quantity }}</div>
                </td>
                <td>
                  <div>R$ {{ props.item.total_purchase }}</div>
                </td>
                <td>
                  <div>{{ props.item.color }}</div>
                </td>
                <td>
                  <div>{{ checkSize(props.item.size) }}</div>
                </td>
                <td>
                  <div>{{ props.item.dt_purchase | friendlyDate }}</div>
                </td>
                <td class="text-md-justify">
                  <v-icon
                    small
                    class="mr-2"
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
                <v-btn flat @click="snack = false">Close</v-btn>
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
      pagination: {},
      sizes: [
        {key: 'P', description: 'Pequeno'},
        {key: 'M', description: 'Médio'},
        {key: 'G', description: 'Grande'},
        {key: 'U', description: 'Único'},
      ],
      snack: false,
      currentPage: 1,
      snackColor: '',
      moment: moment,
      menu: false,
      modal: false,
      snackText: '',
      max25chars: v => v.length <= 25 || 'Input too long!',
      data: [],
      rowsAmount: [10, 15, 20, {'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1}],
      dialog: false,
      search: '',
      headers: [
        {text: 'Produto', value: 'product_name'},
        {text: 'Fornecedor', value: 'provider_name'},
        {text: 'Preço', value: 'price'},
        {text: 'Quantidade', value: 'quantity'},
        {text: 'Total', value: 'total_purchase'},
        {text: 'Cor', value: 'color'},
        {text: 'Tamanho', value: 'size'},
        {text: 'Data', value: 'dt_purchase'},
        {text: 'Ações', value: 'actions', sortable: false}

      ],
      filterProductName: '',
      filterProviderName: '',
      editedIndex: -1,
      editedItem: {
        purchase_id: '',
        product_name: '',
        provider_name: '',
        price: '',
        quantity: '',
        user_id: '',
        size: '',
        color: '',
        observation: '',
        total_purchase: '',
        dt_purchase: ''
      },
    }),

    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'Nova Compra' : 'Editar Compra'
      }
    },

    watch: {
      currentPage: function (val) {
        this.getPurchase('?page=' + val)
      },
      filterProductName: function (filter) {
        this.getPurchase('?search=product_name:' + filter)
      },
      filterProviderName: function (filter) {
        this.getPurchase('?search=provider_name:' + filter)
      }
    },
    mounted() {
      return this.getPurchase();
    },

    methods: {
      getPurchase(filter = '') {
        this.$http.get('/purchase' + filter)
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
        let endpoint = `purchase/${this.editedItem.purchase_id}`;
        let method = 'DELETE';
        this.callTableAction(item, endpoint, method);
        this.getPurchase()
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
          let endpoint = `purchase/${this.editedItem.purchase_id}`;
          let method = 'put';
          this.$store.dispatch('updateTableItem', {endpoint, tableItem, method})
            .then((response) => {
              console.log(response);
              this.saveInline(response.data);
              this.getPurchase()
            })
            .catch(error => {
              console.log(error);
              return this.cancelInline
            })
        } else {
          let tableItem = this.editedItem;
          this.data.push(this.editedItem);
          let endpoint = `purchase`;
          let method = 'POST';
          this.$store.dispatch('updateTableItem', {endpoint, tableItem, method})
            .then((response) => {
              this.saveInline(response.data);
              this.getPurchase()
            })
            .catch(error => {
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
  table.v-table tbody td {
    font-size: 12px !important;
    font-weight: 300;
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
