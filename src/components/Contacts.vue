<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="mt-10" no-gutters>
      <v-col cols="6">
        <v-data-table
          :headers="headers"
          :items="contacts"
          :items-per-page="5"
          class="elevation-1"
          dark
          :loading="loading"
          loading-text="Carregando... Por favor, aguarde."
          no-data-text="Nenhum contato encontrado."
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Lista de Contatos</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn @click="addContact()" color="primary" dark class="mb-2">
                Novo Contato
              </v-btn>
              <v-dialog v-model="dialogInsert" width="500" hide-overlay>
                <v-card elevation="2" tile>
                  <v-card-title>
                    Novo contato
                    <v-spacer />
                    <v-btn icon @click="close()" color="black" dark right>
                      <v-icon v-text="'mdi-close'" />
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-row>
                            <v-text-field
                              v-model="newContact.name"
                              label="Nome"
                              :rules="[rules.required, rules.minName]"
                            ></v-text-field>
                          </v-row>
                          <v-row>
                            <v-text-field
                              v-model="newContact.phone"
                              label="Telefone"
                              :rules="[rules.required, rules.minPhone]"
                            ></v-text-field>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" text @click="confirmAdd"
                      >Adicionar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogEdit" width="500" hide-overlay>
                <v-card elevation="2" tile>
                  <v-card-title>
                    Editar contato
                    <v-spacer />
                    <v-btn icon @click="close()" color="black" dark right>
                      <v-icon v-text="'mdi-close'" />
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-row>
                            <v-text-field
                              v-model="editedContact.name"
                              label="Nome"
                              :rules="[rules.required, rules.minName]"
                            ></v-text-field>
                          </v-row>
                          <v-row>
                            <v-text-field
                              v-model="editedContact.phone"
                              label="Telefone"
                              :rules="[rules.required, rules.minPhone]"
                            ></v-text-field>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" text @click="confirmEdit"
                      >Confirmar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" width="500" hide-overlay>
                <v-card elevation="2" tile>
                  <v-card-title>
                    Deletar contato
                    <v-spacer />
                    <v-btn icon @click="close()" color="black" dark right>
                      <v-icon v-text="'mdi-close'" />
                    </v-btn>
                  </v-card-title>

                  <v-card-text>
                    Tem certeza que deseja deletar {{ deleteContact.name }}?
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" text @click="confirmDelete()"
                      >Confirmar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editContact(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="removeContact(item)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-snackbar
      v-if="snackbar.show"
      v-model="snackbar.show"
      multi-line
      :color="snackbar.color"
    >
      {{ snackbar.message }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: false,
      snackbar: {
        show: false,
        message: "",
        color: "",
      },
      headers: [
        { text: "ID", align: "start", value: "id", width: 150 },
        { text: "Nome", value: "name" },
        { text: "Telefone", value: "phone", sortable: false },
        { text: "Ações", value: "actions", sortable: false },
      ],
      dialogEdit: false,
      dialogDelete: false,
      dialogInsert: false,
      editedContact: {},
      newContact: {},
      deleteContact: {},
      rules: {
        required: (value) => !!value || "Obrigarótio",
        minPhone: (value) => value.length >= 8 || "Mínimo 8 caracteres",
        minName: (value) => value.length >= 2 || "Mínimo 2 caracteres",
      },
    };
  },
  methods: {
    ...mapActions(["getContacts"]),

    editContact(item) {
      this.editedContact = Object.assign({}, item);
      this.dialogEdit = true;
    },

    addContact() {
      this.dialogInsert = true;
    },

    removeContact(item) {
      this.deleteContact = item;
      this.dialogDelete = true;
    },

    confirmEdit() {
      this.loading = true;
      const payload = {
        name: this.editedContact.name,
        phone: this.editedContact.phone,
      };
      this.$axios
        .patch(`contacts/${this.editedContact.id}`, payload)
        .then(() => {
          this.getContacts();
          this.close();
          this.snackbar.show = true;
          this.snackbar.message = "Contato adicionado com sucesso!";
          this.snackbar.color = "green";
        })
        .catch(() => {
          this.snackbar.show = true;
          this.snackbar.message = "Falha ao adicionar o contato.";
          this.snackbar.color = "red";
        })
        .finally(() => {
          this.loading = false;
        });
    },

    confirmAdd() {
      this.loading = true;
      const payload = {
        name: this.newContact.name,
        phone: this.newContact.phone,
      };
      this.$axios
        .post("contacts", payload)
        .then(() => {
          this.getContacts();
          this.close();
          this.snackbar.show = true;
          this.snackbar.message = "Contato adicionado com sucesso!";
          this.snackbar.color = "green";
        })
        .catch(() => {
          this.snackbar.show = true;
          this.snackbar.message = "Falha ao adicionar o contato.";
          this.snackbar.color = "red";
        })
        .finally(() => {
          this.loading = false;
        });
    },

    confirmDelete() {
      this.loading = true;
      this.$axios
        .delete(`contacts/${this.deleteContact.id}`)
        .then(() => {
          this.getContacts();
          this.close();
          this.snackbar.show = true;
          this.snackbar.message = "Contato removido com sucesso!";
          this.snackbar.color = "green";
        })
        .catch(() => {
          this.snackbar.show = true;
          this.snackbar.message = "Falha ao remover o contato.";
          this.snackbar.color = "red";
        })
        .finally(() => {
          this.loading = false;
        });
    },

    close() {
      this.dialogDelete = false;
      this.dialogInsert = false;
      this.dialogEdit = false;
    },
  },
  computed: {
    ...mapGetters(["contacts"]),
  },
  mounted() {
    this.loading = true;
    this.getContacts()
      .then(() => {
        this.snackbar.show = true;
        this.snackbar.message = "Contatos carregados com sucesso!";
        this.snackbar.color = "green";
      })
      .catch(() => {
        this.snackbar.show = true;
        this.snackbar.message = "Falha ao carregar os contatos.";
        this.snackbar.color = "red";
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style></style>
