document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.projects-grid .modern-project-card').forEach(function (card) {
    if (card.querySelector('.project-card-front')) return;
    const body = card.querySelector('.project-card-body');
    const footer = card.querySelector('.project-card-footer');
    if (!body || !footer) return;
    const title = body.querySelector('h3');
    const description = body.querySelector('p');
    const pills = body.querySelector('.tech-pills');
    if (!title) return;
    const front = document.createElement('div'); front.className='project-card-front';
    while (card.firstChild) front.appendChild(card.firstChild);
    card.appendChild(front);
    const back = document.createElement('div'); back.className='project-card-back';
    back.appendChild(title.cloneNode(true));
    if (description) { const desc=description.cloneNode(true); desc.classList.add('back-description'); back.appendChild(desc); }
    if (pills) back.appendChild(pills.cloneNode(true));
    const actions=document.createElement('div'); actions.className='project-back-actions';
    const link=footer.querySelector('a[href]'); if(link) actions.appendChild(link.cloneNode(true));
    const backButton=document.createElement('button'); backButton.type='button'; backButton.className='flip-card-button'; backButton.setAttribute('aria-label','Back to '+title.textContent); backButton.innerHTML='<i class="fas fa-undo" aria-hidden="true"></i>'; actions.appendChild(backButton);
    back.appendChild(actions); card.appendChild(back);
    let frontButton=footer.querySelector('.btn-flip-card, .flip-card-button');
    if (!frontButton) { frontButton=document.createElement('button'); footer.appendChild(frontButton); }
    frontButton.className='flip-card-button'; frontButton.type='button'; frontButton.setAttribute('aria-label','View details for '+title.textContent); frontButton.innerHTML='<i class="fas fa-sync-alt" aria-hidden="true"></i>';
    function flip(on) { card.classList.toggle('is-flipped',on); frontButton.setAttribute('aria-expanded',String(on)); front.inert=on; back.inert=!on; back.setAttribute('aria-hidden',String(!on)); }
    frontButton.addEventListener('click',function(e){e.stopPropagation();flip(true);});
    backButton.addEventListener('click',function(e){e.stopPropagation();flip(false);});
    flip(false);
  });
});
