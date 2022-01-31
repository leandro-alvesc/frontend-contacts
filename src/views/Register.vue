<template>
  <v-container fluid>
    <v-row align="center" justify="center" class="mt-10" no-gutters>
      <v-col cols="12">
        <v-card class="mx-auto" height="640" max-width="350" outlined>
          <v-card-title class="text-center py-8 justify-center"
            >Registro</v-card-title
          >
          <v-card-text>
            <v-text-field
              v-model="username"
              :rules="[rules.required, rules.minUser]"
              label="Usuário"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="name"
              :rules="[rules.required, rules.minUser]"
              label="Nome"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.emailValidation, rules.minEmail]"
              label="Email"
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="phone"
              label="Telefone"
              type="text"
            ></v-text-field>
            <v-text-field
              label="Senha"
              v-model="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.minPass]"
              :type="showPassword ? 'text' : 'password'"
              hint="Pelo menos 8 caracteres"
              counter
              @click:append="showPassword = !showPassword"
            ></v-text-field>
            <v-text-field
              label="Repita a Senha"
              type="password"
              v-model="repeatPassword"
              :rules="[rules.required, rules.minPass]"
              hint="Pelo menos 8 caracteres"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="mx-2 mt-4">
            <v-btn :loading="loading" outlined x-large block @click="register"
              >Registrar</v-btn
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
export default {
  name: "register",

  data() {
    return {
      username: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      repeatPassword: "",
      showPassword: false,
      rules: {
        required: (value) => !!value || "Obrigarótio",
        minPass: (value) => value.length >= 8 || "Mínimo 8 caracteres",
        minUser: (value) => value.length >= 5 || "Mínimo 5 caracteres",
        minEmail: (value) => value.length >= 5 || "Mínimo 6 caracteres",
        emailValidation: (v) => /.+@.+/.test(v) || "E-mail inválido",
      },
      snackbar: {
        show: false,
        message: "",
        color: "",
      },
      loading: false,
    };
  },

  methods: {
    register() {
      this.loading = true;
      let payload = {
        username: this.username,
        name: this.name,
        email: this.email,
        phone: this.phone,
        password: this.password,
      };
      return this.$axios
        .post("auth/register", payload)
        .then(() => {
          this.snackbar.show = true;
          this.snackbar.message = "Usuário registrado com sucesso.";
          this.snackbar.color = "green";
          this.$router.push({ name: "Login" });
        })
        .catch(({ response }) => {
          this.snackbar.show = true;
          this.snackbar.message = "Não foi possível registrar o usuário.";
          this.snackbar.color = "red";
          if (response.data.code === "UNIQUE_VIOLATION") {
            this.snackbar.message = "Esse usuário já existe.";
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
