<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="mt-10" no-gutters>
      <v-col cols="12">
        <v-card dark class="mx-auto" height="420" max-width="350" outlined>
          <v-card-title class="text-center py-8 justify-center"
            >Lista de Contatos</v-card-title
          >
          <v-card-text>
            <v-text-field
              v-model="username"
              label="Usuário"
              type="text"
            ></v-text-field>
            <v-text-field
              label="Senha"
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.minPass]"
              :type="showPassword ? 'text' : 'password'"
              hint="Pelo menos 8 caracteres"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="mx-2 my-7">
            <v-btn outlined :loading="loading" x-large block @click="login"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
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
import { mapActions } from "vuex";
export default {
  name: "login",

  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      loading: false,
      rules: {
        required: (value) => !!value || "Obrigarótio",
        minPass: (value) => value.length >= 8 || "Mínimo 8 caracteres",
        minUser: (value) => value.length >= 5 || "Mínimo 8 caracteres",
      },
      snackbar: {
        show: false,
        message: "",
        color: "",
      },
    };
  },

  methods: {
    ...mapActions(["authenticate"]),

    login() {
      const login = {
        username: this.username,
        password: this.password,
      };
      this.loading = true;
      this.authenticate(login)
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch(() => {
          this.snackbar.show = true;
          this.snackbar.message = "Usuário ou senha inválidos";
          this.snackbar.color = "red";
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
