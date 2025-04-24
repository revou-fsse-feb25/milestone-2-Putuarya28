const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let firstCard, secondCard;

function flipcard() {
    this.classList.add('flip'); //menambahkan class baru dengan nama 'flip'
    if (!hasFlippedCard) {
        //first click
        hasFlippedCard = true;
        firstCard = this;
    } else {
        //second click
        hasFlippedCard = false;
        secondCard = this;


        //do cards match?
        if (firstCard.dataset.romangods === secondCard.dataset.romangods) {
        //it's a match!!
            firstCard.removeEventListener('click', flipcard);
            secondCard.removeEventListener('click', flipcard);
        } else {
            //not a match
            setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            }, 1500);
        }
    }
}
cards.forEach(card => card.addEventListener('click', flipcard))
