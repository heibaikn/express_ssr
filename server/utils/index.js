const sirvPaths = {
  'index/index': {
    base: '/'
  },
}
exports.getSirvPaths = async function (req, name) {
  console.log(req.appState.isProd);
  const info = sirvPaths[name];
  if (!req.appState.isProd) {
    const { createServer } = await import('vite')
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base: info.base
    })
    app.use(vite.middlewares)
    // req.app.set('views', path.join(__dirname, '../dist/page'));
    // req.app.use(express.static(path.join(__dirname, '../dist')));
  } else {
    // req.app.set('views', path.join(__dirname, '../dist'));
    // req.app.use(express.static(path.join(__dirname, '../dist')));
  }
};
