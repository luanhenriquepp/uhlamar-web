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
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Busca"
              single-line
              hide-details/>
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
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          v-model="editedItem.product_name"
                          label="Produto"/>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          v-model="editedItem.provider_name"
                          label="Fornecedor"/>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          v-model="editedItem.color"
                          label="Cor"/>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          v-model="editedItem.quantity"
                          label="Quantidade"/>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          v-model="editedItem.size"
                          label="Tamanho"/>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
                        <v-text-field
                          v-model="editedItem.price"
                          label="Preço"/>
                      </v-flex>
                      <v-flex xs12 sm6 md4>
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
              v-if="pagination.total > pagination.per_page"
              :headers="headers"
              :items="data"
              :search="search"
              :loading="loading"
              :items-per-page="pagination.per_page"
              :server-items-length="pagination.total"
              class="elevation-1"
              hide-actions
            >
              <!-- change table header background and text color(or other properties) -->
              <template slot="headerCell" slot-scope="{ header }">
                <span
                  class="subheading font-weight-light text-general text--darken-3"
                  v-text="header.text"
                />
              </template>
              <template v-slot:items="props">
                <td>{{ props.item.purchase_id }}</td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.product_name"
                    large
                    lazy
                    persistent
                    @save="saveInline"
                    @cancel="cancelInline"
                    @open="openInline"
                    @close="closeInline"
                  >
                    <div>{{ props.item.product_name }}</div>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.product_name"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </td>

                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.provider_name"
                    large
                    lazy
                    persistent
                    @save="save"
                    @cancel="cancelInline"
                    @open="openInline"
                    @close="closeInline"
                  >
                    <div>{{ props.item.provider_name }}</div>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.provider_name"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.price"
                    large
                    lazy
                    persistent
                    @save="save"
                    @cancel="cancelInline"
                    @open="openInline"
                    @close="closeInline"
                  >
                    <div>{{ props.item.price }}</div>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.price"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </td>

                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.color"
                    large
                    lazy
                    persistent
                    @save="save"
                    @cancel="cancelInline"
                    @open="openInline"
                    @close="closeInline"
                  >
                    <div>{{ props.item.color }}</div>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.color"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </td>

                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.quantity"
                    large
                    lazy
                    persistent
                    @save="save"
                    @cancel="cancelInline"
                    @open="openInline"
                    @close="closeInline"
                  >
                    <div>{{ props.item.quantity }}</div>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.quantity"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.size"
                    large
                    lazy
                    persistent
                    @save="save"
                    @cancel="cancelInline"
                    @open="openInline"
                    @close="closeInline"
                  >
                    <div>{{ verificaTamanho(props.item.size) }}</div>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.size"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.total_purchase"
                    large
                    lazy
                    persistent
                    @save="save"
                    @cancel="cancelInline"
                    @open="openInline"
                    @close="closeInline"
                  >
                    <div>{{ props.item.total_purchase }}</div>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.total_purchase"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </td>
                <td>
                  <v-edit-dialog
                    :return-value.sync="props.item.dt_purchase"
                    large
                    lazy
                    persistent
                    @save="save"
                    @cancel="cancelInline"
                    @open="openInline"
                    @close="closeInline"
                  >
                    <div>{{ props.item.dt_purchase | friendlyDate }}</div>
                    <template v-slot:input>
                      <v-text-field
                        v-model="props.item.dt_purchase"
                        :rules="[max25chars]"
                        label="Edit"
                        single-line
                        counter
                        autofocus
                      />
                    </template>
                  </v-edit-dialog>
                </td>
                <td class="justify-center ">
                  <v-icon
                    medium
                    class="mr-2"
                    @click="editItem(props.item)">edit
                  </v-icon>
                  <v-icon
                    medium
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
    snack: false,
    currentPage: 1,
    snackColor: '',
    moment: moment,
    menu: false,
    modal: false,
    snackText: '',
    max25chars: v => v.length <= 25 || 'Input too long!',
    data: '',
    rowsAmount: [10, 15, 20, {'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1}],
    dialog: false,
    search: '',
    headers: [
      {text: 'ID', align: 'left', value: 'id'},
      {text: 'Produto', value: 'product_name'},
      {text: 'Fornecedor', value: 'provider_name'},
      {text: 'Preço', value: 'price'},
      {text: 'Cor', value: 'color'},
      {text: 'Quantidade', value: 'quantity'},
      {text: 'Tamanho', value: 'size'},
      {text: 'Total', value: 'total_purchase'},
      {text: 'Data', value: 'dt_purchase'},
      {text: 'Ações', value: 'actions', sortable: false}

    ],
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
    }
  },
  mounted() {
    return this.getPurchase();
  },

  methods: {
    getPurchase(filtro = '') {
      this.$http.get('/purchase' + filtro)
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

    verificaTamanho(value) {
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
          .then((response) => console.log(response.data.data))
          .catch(error => {
            this.getPurchase();
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

  tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
  }
</style>
