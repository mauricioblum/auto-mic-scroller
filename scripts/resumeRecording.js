console.log('Trying to resume recording...');
try {
  window.micScroller.start();
  console.log('Sucessfully resumed recording!');
} catch(err) {
  console.log(err);
}