<template>
  <v-form @submit.prevent="submit" v-model="valido">
    <v-text-field
      v-model="usuarioForm.nome"
      :rules="rules.required"
      label="Nome Completo"
      type="text"
      maxlength="80"
      :disabled="disabled"
      required
    ></v-text-field>
    <v-text-field v-model="usuarioForm.cpf" :rules="rules.cpf" label="CPF" type="text" maxlength="11" :disabled="disabled" required></v-text-field>
    <v-text-field v-model="usuarioForm.email" :rules="rules.required" label="E-mail" type="email" maxlength="80" :disabled="disabled" required></v-text-field>
    <v-text-field
      v-model="usuarioForm.senha"
      :rules="rules.password"
      label="Senha"
      :append-icon="viewPass ? 'mdi-eye-off-outline' : 'mdi-eye'"
      @click:append="() => (viewPass = !viewPass)"
      :type="viewPass ? 'text' : 'password'"
      :disabled="disabled"
      required
    ></v-text-field>
    <v-divider class="mt-4"></v-divider>
    <v-row>
      <v-col class="col-12 col-md-3">
        <v-text-field
          v-model="usuarioForm.cep"
          :rules="rules.required"
          label="CEP"
          type="text"
          @keyup="cep"
          maxlength="8"
          :disabled="disabled"
          required
        ></v-text-field>
      </v-col>
      <v-col class="col-12 col-md-9">
        <v-text-field v-model="usuarioForm.rua" :rules="rules.required" label="Rua" type="text" :disabled="disabled" required></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-12 col-md-3">
        <v-text-field
          v-model="usuarioForm.numero"
          :rules="rules.required"
          label="Numero"
          type="text"
          maxlength="6"
          :disabled="disabled"
          required
        ></v-text-field>
      </v-col>
      <v-col class="col-12 col-md-9">
        <v-text-field
          v-model="usuarioForm.bairro"
          :rules="rules.required"
          label="Bairro"
          type="text"
          maxlength="6"
          :disabled="disabled"
          required
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-12 col-md-9">
        <v-text-field v-model="usuarioForm.cidade" :rules="rules.required" label="Cidade" type="text" :disabled="disabled" required></v-text-field>
      </v-col>
      <v-col class="col-12 col-md-3">
        <v-text-field v-model="usuarioForm.estado" :rules="rules.required" label="Estado" type="text" :disabled="disabled" required></v-text-field>
      </v-col>
    </v-row>
    <v-text-field v-model="usuarioForm.telefone" :rules="rules.phone" label="Telefone" type="number" :disabled="disabled" required></v-text-field>

    <div class="flex-center mt-4">
      <v-btn class="btn-login pa-6" type="submit" @click.prevent="submeter" :disabled="!valido || disabled">
        <slot></slot>
      </v-btn>
    </div>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getCep } from '@/services/cep';

import Usuario from '@/models/Usuario';
import Login from '@/models/Login';
import { mapActions, mapState } from 'vuex';

@Component({
  computed: {
    ...mapState('geral', ['rules']),
    ...mapState('usuario', ['usuario', 'logado', 'disabled']),
  },
  methods: mapActions('usuario', ['criarUsuario', 'getUsuario', 'atualizarUsuario']),
})
export default class UsuarioForm extends Vue {
  public valido: boolean = false;
  public viewPass: boolean = false;
  public usuario: Usuario;
  public usuarioForm: Usuario = {};
  public logado!: boolean;
  public criarUsuario!: (usuario: Usuario) => any;
  public getUsuario!: (login: Login) => void;
  public atualizarUsuario!: (usuario: Usuario) => void;

  public cep(): void {
    const cep = this.usuarioForm.cep.replace(/\D/g, '');
    if (cep.length === 8) {
      getCep(cep).then((response) => {
        this.usuarioForm.rua = response.data.logradouro;
        this.usuarioForm.bairro = response.data.bairro;
        this.usuarioForm.cidade = response.data.localidade;
        this.usuarioForm.estado = response.data.uf;
      });
    }
  }

  public async submeter(): Promise<void> {
    if (!this.logado) {
      const response = await this.criarUsuario(this.usuarioForm);
      if (response) {
        this.getUsuario({ email: this.usuarioForm.email, senha: this.usuarioForm.senha });
        this.$router.push({ name: 'Usuario' });
      }
    } else {
      this.atualizarUsuario(this.usuarioForm);
    }
  }

  public created(): void {
    this.usuarioForm = { ...this.usuario };
  }
}
</script>

<style lang="scss">
@import '@/sass/custom.scss';
.btn-login {
  width: 100%;
  max-width: 300px !important;
  background-color: darken($primary, 10%) !important;
}
</style>
