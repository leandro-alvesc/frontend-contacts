<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="mt-10" no-gutters>
      <v-col cols="6">
        <h1 class="text-center py-8 justify-center">Lista de Contatos</h1>
        <v-data-table
          :headers="headers"
          :items="contacts"
          :items-per-page="5"
          class="elevation-1"
          dark
          :loading="loading"
          loading-text="Carregando... Por favor, aguarde."
          no-data-text="Nenhum contato encontrado."
        ></v-data-table>
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
      ],
    };
  },
  methods: {
    ...mapActions(["getContacts"]),
  },
  computed: {
    ...mapGetters(["contacts"]),
  },
  mounted() {
    this.loading = true;
    this.getContacts()
      .then(() => {
        console.log(this.contacts);
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
