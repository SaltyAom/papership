if ('serviceWorker' in navigator) {
  window.onload = () => {
    navigator.serviceWorker.register('sw.js', {scope: '/'})
    .then(registration => {
      console.info('Registered:', registration);
      }).catch(function(error) {
      console.error('Registration failed: ', error);
    });
  }
}