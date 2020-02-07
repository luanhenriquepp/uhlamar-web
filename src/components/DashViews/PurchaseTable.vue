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
            title="Tabela de compras"
          >
            <v-spacer/>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
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
                  v-on="on">Nova compra</v-btn>
              </template>

              <v-card>
                <v-card-text>
                  <v-container grid-list-md >
                    <v-layout wrap>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          v-model="editedItem.username"
                          label="Username" />
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          v-model="editedItem.password"
                          label="Password" />
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"/>
                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-checkbox
                          v-model="checkboxAdmin"
                          :label="`IsAdmin`"/>

                      </v-flex>
                      <v-flex
                        xs12
                        sm6
                        md4>
                        <v-checkbox
                          v-model="checkboxActive"
                          :label="`IsActive`"/>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer/>
                  <v-btn
                    color="blue darken-1"
                    flat
                    @click="close">Cancel</v-btn>
                  <v-btn
                    color="blue darken-1"
                    flat
                    @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-data-table
              :headers="headers"
              :items="purchaseList"
              :rows-per-page-items ="rowsAmount"
              :search="search"
              class="elevation-1"
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
                    <div>{{ props.item.size }}</div>
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
                    <div>{{ props.item.dt_purchase }}</div>
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
                          @click="editItem(props.item)">edit</v-icon>
                  <v-icon
                          medium
                          @click="deleteItem(props.item)">delete</v-icon>
                </td>
              </template>
            </v-data-table>
            <v-snackbar
              v-model="snack"
              :timeout="3000"
              :color="snackColor">
              {{ snackText }}
              <v-btn
                flat
                @click="snack = false">Close</v-btn>
            </v-snackbar>
          </material-card>
        </div>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    snack: false,
    snackColor: '',
    snackText: '',
    max25chars: v => v.length <= 25 || 'Input too long!',
    pagination: {},
    purchaseList: [],
    checkboxAdmin: true,
    checkboxActive: true,
    rowsAmount: [15, 20, 25, { 'text': '$vuetify.dataIterator.rowsPerPageAll', 'value': -1 }],
    dialog: false,
    search: '',
    headers: [
      { text: 'ID', align: 'left', value: 'id' },
      { text: 'Produto', value: 'product_name' },
      { text: 'Fornecedor', value: 'provider_name' },
      { text: 'Preço', value: 'price' },
      { text: 'Quantidade', value: 'quantity' },
      { text: 'Tamanho', value: 'size' },
      { text: 'Total', value: 'total_purchase' },
      { text: 'Data', value: 'dt_purchase' },
      { text: 'Ações', value: 'actions', sortable: false }

    ],
    editedIndex: -1,
    editedItem: {
      purchase_id: '',
      product_name: '',
      provider_name: '',
      quantity: '',
      size: '',
      total_purchase: '',
      dt_purchase: '',
    },
    defaultItem: {

    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Nova Compra' : 'Editar Compra'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  created () {
    this.getPurchase()
  },

  methods: {
    getPurchase () {
      this.$http.get('/purchase')
      .then(response => {
        console.log(response.data.data.data)
          this.purchaseList = response.data.data.data
        })
      .catch(error => console.log(error))
    },

    // object.assign fills in the empty object with the properties of item
    editItem (item, dbox = true) {
      this.editedIndex = this.purchaseList.indexOf(item)
      item.isAdmin = this.checkboxAdmin
      item.isActive = this.checkboxActive
      this.editedItem = Object.assign({}, item)
      this.dialog = dbox
    },

    callTableAction (item, endpoint, method) {
      let tableItem = this.editedItem
      this.$store.dispatch('updateTableItem', { endpoint, tableItem, method })
      .then((response) => this.saveInline(response.data))
      .catch(error => {
        console.log(error)
        this.cancelInline
      })
    },

    deleteItem (item) {
      const index = this.purchaseList.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.purchaseList.splice(index, 1)
      this.editedItem = Object.assign({}, item)
      let endpoint = `purchase/${this.editedItem.purchase_id}`
      let method = 'DELETE'
      this.callTableAction(item, endpoint, method)
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
        Object.assign(this.purchaseList[this.editedIndex], this.editedItem)
        let tableItem = this.editedItem
        let endpoint = `users/update/${this.editedItem.username}`
        let method = 'patch'
        this.$store.dispatch('updateTableItem', { endpoint, tableItem, method })
        .then((response) => {
          console.log(response)
          this.saveInline()
        })
        .catch(error => {
          console.log(error)
          this.cancelInline
        })
      } else {
        let tableItem = this.editedItem
        this.purchaseList.push(this.editedItem)
        let endpoint = `users/new-user`
        let method = 'post'
        this.$store.dispatch('updateTableItem', { endpoint, tableItem, method })
        .then((response) => console.log('new user'))
        .catch(error => {
          console.log(error)
          this.cancelInline
          })
      }
      this.close()
    },
    // toasts/snackbar messages for actions
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
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, .05);
}
</style>
