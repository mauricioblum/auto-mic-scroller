console.log('Trying to stop recording...');
try {
  window.micScroller.stop();
  console.log('Sucessfully paused recording!');
} catch(err) {
  console.log(err);
}