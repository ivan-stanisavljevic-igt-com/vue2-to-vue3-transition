window.onload = function() {
  const xtremepushID = window.ctsautoconf.XTREMEPUSH_ANALYTICS.WEB_KEY
  if (xtremepushID && !window.ctsautoconf.MOBILE_LS) {
    localStorage.setItem('xpKey', xtremepushID);
    console.log('xtremepush key - init', xtremepushID);
    (function(p,u,s,h,e,r,l,i,b) {p['XtremePushObject']=s;p[s]=function(){
      (p[s].q=p[s].q||[]).push(arguments)};i=u.createElement('script');i.async=1;
      i.src=h;b=u.getElementsByTagName('script')[0];b.parentNode.insertBefore(i,b);
    })(window,document,'xtremepush','https://prod.webpu.sh/' + xtremepushID + '/sdk.js');
    return false
  }
  localStorage.removeItem('xpKey')
}
