import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueMask from 'v-mask';

Vue.use(VueMask);

Vue.config.productionTip = false;

Vue.filter('numeroPreco', (valor: any) => {
  valor = Number(valor);
  if (!isNaN(valor)) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  beforeCreate(): void {
    this.$store.dispatch('carrinho/carrinhoLocalStorage');
    this.$store.dispatch('usuario/usuarioLocalStorage');
  },
}).$mount('#app');
