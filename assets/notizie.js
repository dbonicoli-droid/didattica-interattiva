(() => {
 const board=document.querySelector('.news-board'),feed=document.getElementById('news-feed');
 if(!board||!feed)return;
 const actions=board.querySelector('.news-actions'),buttons=[...actions.querySelectorAll('button')];
 actions.hidden=false;
 const update=()=>{buttons[0].disabled=feed.scrollTop<=1;buttons[1].disabled=feed.scrollTop+feed.clientHeight>=feed.scrollHeight-1;};
 for(const button of buttons)button.addEventListener('click',()=>feed.scrollBy({top:Number(button.dataset.newsDirection)*feed.clientHeight*.7,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
 feed.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(feed);update();
})();
