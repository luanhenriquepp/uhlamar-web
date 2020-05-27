<template>
  <v-container
    fill-height
    fluid
    grid-list-xl>
    <v-layout
      justify-center
      wrap>
      <v-flex md12>
        <div>
          <material-card
            color="general"
            title="Compras">
            <v-spacer/>
            <v-layout>
              <v-flex xs4>
                <v-text-field
                  v-model="filter.coupon_name"
                  append-icon="search"
                  label="Nome do Cupom"
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
                  v-on="on">Novo Cupon
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
                          v-model="editedItem.coupon_name"
                          label="Cupom"/>
                      </v-flex>
                      <v-flex
                        xs10
                        sm24
                        md4>
                        <v-text-field
                          v-model="editedItem.percentage"
                          suffix="%"
                          label="Porcentagem"/>
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
              <template
                slot="headerCell"
                slot-scope="{ header }">
                <span
                  class="font-weight-light text-general text--darken-2"
                  v-text="header.text"
                />
              </template>
              <template v-slot:items="props">

                <td>
                  <div>{{ props.item.coupon_name }}</div>
                </td>
                <td>
                  <div>{{ props.item.percentage }}</div>
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
                <v-btn
                  flat
                  @click="snack = false">Close</v-btn>
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
  import _ from 'lodash'

  export default {

    data: () => ({
      loading: true,
      pagination: {},
      filter: {},
      snack: false,
      currentPage: 1,
      snackColor: '',
      menu: false,
      modal: false,
      snackText: '',
      max25chars: v => v.length <= 25 || 'Input too long!',
      data: [],
      dialog: false,
      search: '',
      headers: [
        { text: 'Cupom', value: 'coupon_name', sortable: false },
        { text: 'Porcentagem', value: 'percentage', sortable: false },
        { text: 'Ações', value: 'actions', sortable: false }

      ],
      editedIndex: -1,
      editedItem: {
        coupon_name: '',
        percentage: '',
        coupon_id: ''
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Cupom' : 'Editar Cupom'
      }
    },

    watch: {
      filter: {
        handler: _.debounce(function (val) {
          if (val) {
            const queryString = Object.keys(val).map(key => key + ':' + val[key]).join(';')
            return this.getCoupon('?search=' + queryString)
          }
        }, 500),
        deep: true
      },
      currentPage: function (val) {
        this.getCoupon('?page=' + val)
      }
    },
    created () {
      return this.getCoupon()
    },

    methods: {
      getCoupon (filter = '') {
        this.$http.get('/coupon' + filter)
          .then(response => {
            this.pagination = response.data.data
            this.data = response.data.data.data
          })
          .catch(error => console.log(error))
      },

      editItem (item, dbox = true) {
        this.editedIndex = this.data.indexOf(item)
        item.isAdmin = this.checkboxAdmin
        item.isActive = this.checkboxActive
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

      callTableAction (item, endpoint, method) {
        let tableItem = this.editedItem
        this.$store.dispatch('updateTableItem', { endpoint, tableItem, method })
          .then((response) => this.saveInline(response.data))
          .catch(error => {
            console.log(error)
            return this.cancelInline
          })
      },

      deleteItem (item) {
        const index = this.data.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.data.splice(index, 1)
        this.editedItem = Object.assign({}, item)
        let endpoint = `coupon/${this.editedItem.coupon_id}`
        let method = 'DELETE'
        this.callTableAction(item, endpoint, method)
        this.getCoupon()
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
          let endpoint = `coupon/${this.editedItem.coupon_id}`
          let method = 'put'
          this.$store.dispatch('updateTableItem', { endpoint, tableItem, method })
            .then((response) => {
              console.log(response)
              this.saveInline(response.data)
              this.getCoupon()
            })
            .catch(error => {
              console.log(error)
              return this.cancelInline
            })
        } else {
          const user = localStorage.getItem('user')
          this.editedItem.user_id = user
          let tableItem = this.editedItem
          this.data.push(this.editedItem)
          let endpoint = `coupon`
          let method = 'POST'
          this.$store.dispatch('updateTableItem', { endpoint, tableItem, method })
            .then((response) => {
              this.saveInline(response.data)
              this.getCoupon()
            })
            .catch(error => {
              console.log(error)
              return this.cancelInline
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
