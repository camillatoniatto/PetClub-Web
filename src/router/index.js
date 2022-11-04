import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import registerUser from '../store/modules/users.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    // meta: { requiresAuth: true },
    component: HomeView
  },
  {
    path: '/services',
    name: 'services',
    meta: { requiresAuth: true },
    component: () => import('../views/Services.vue')
  },
  {
    path: '/usersadmin',
    name: 'usersadmin',
    meta: { requiresAuth: true },
    component: () => import('../views/UsersAdmin.vue')
  },
  {
    path: '/userspartner',
    name: 'userspartner',
    meta: { requiresAuth: true },
    component: () => import('../views/UsersPartner.vue')
  },
  {
    path: '/pets',
    name: 'pets',
    meta: { requiresAuth: true },
    component: () => import('../views/Pets.vue')
  },
  {
    path: '/scheduler',
    name: 'scheduler',
    meta: { requiresAuth: true },
    component: () => import('../views/Scheduler.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/cashflow',
    name: 'cashflow',
    meta: { requiresAuth: true },
    component: () => import('../views/CashFlow.vue')
  },
  {
    path: '/purchaseorder',
    name: 'purchaseorder',
    meta: { requiresAuth: true },
    component: () => import('../views/PurchaseOrder.vue')
  },
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.baseURL,
  routes
})


router.beforeEach(async (to, from, next) =>  {
  if (to.matched.some(route => route.meta.requiresAuth)) {
      var ltState = '';
      var userId = '';
      await registerUser.authToken().then(response => {
        if(response['status'] == 200) {
          ltState = response.data.data.hasRegistered;
          userId = response.data.data.id;
          console.log('ltState: ', ltState)
          if (ltState & userId == localStorage.getItem('idUser')){
            next();
          }else if(ltState & userId){
            next();
          }
          else{
            registerUser.logout()
            console.log('logout localStorage!: ', window.localStorage.getItem('accessToken'))

            next({ path: '/login' });
          }
        }
      })
      .catch(e => {
          console.warn('Não foi possivel validar o token',
                        'Erro: ${e}',
                        'TokenLocal:', `${localStorage.getItem('accessToken')}`,
                        'UserIdLocal:', `${localStorage.getItem('userId')}`)
          console.log('Erro: ', e)
          console.log('TokenLocal: ', localStorage.getItem('accessToken'))
          console.log('UserIdLocal: ', localStorage.getItem('userId'))
          registerUser.logout()
          next({ path: '/login' });
      })
  }else {
    console.log("Executing the default Next()");
    next();
  }

  // // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  console.log(previousNearestWithMeta);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  // if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  if (nearestWithMeta){
    nearestWithMeta.meta.metaTags.map(tagDef => {
      const tag = document.createElement('meta');

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute('data-vue-router-controlled', '');

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));
  }
});

export default router