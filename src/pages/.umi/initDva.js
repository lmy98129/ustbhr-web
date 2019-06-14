import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'dept', ...(require('/Users/blean/ustbhr_web/src/models/dept.js').default) });
app.model({ namespace: 'login', ...(require('/Users/blean/ustbhr_web/src/models/login.js').default) });
app.model({ namespace: 'main', ...(require('/Users/blean/ustbhr_web/src/models/main.js').default) });
app.model({ namespace: 'role', ...(require('/Users/blean/ustbhr_web/src/models/role.js').default) });
app.model({ namespace: 'user', ...(require('/Users/blean/ustbhr_web/src/models/user.js').default) });
