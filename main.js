var game = {};

game.board = $("#board");
game.boardSize = $("#board").width();
game.resetButton = $("#reset");
game.score = $("#score");
game.counter = 0; //ilość wykonanych ruchów
game.componentSize = 0; //wielkość jednego elementu
game.tabPosition = []; //pozycje wszystkich elementów
game.lastIndex = 0; //index do pustego elementu
game.emptyTop = 0;
game.emptyLeft = 0;
game.start = false; 

game.startMenu = function()
{
    this.resetButton.css({'display': 'none'});
    this.score.css({'display': 'none'});
    this.board.empty();
    this.board.css({'background-image': 'url("img/obraz.png")'});
    this.board.append("<div id=\"menu\"></div>");
    var menu = $("#menu");
    menu.append("<button class=\"level\" difficulty=\"3\">Easy</button>");
    menu.append("<button class=\"level\" difficulty=\"4\">Medium</button>");
    menu.append("<button class=\"level\" difficulty=\"5\">Hard</button>");

    $(".level").click(function(){
        game.startGame($(this).attr("difficulty"));
    });
}

game.startGame = function(difficulty)
{
    this.start = true;
    this.counter = 0;
    this.resetButton.css({'display': 'block'});
    this.score.css({'display': 'block'});
    this.score.empty();
    this.board.empty();
    this.board.css({'background-image': 'none'});
    this.componentSize = Math.floor(this.boardSize/difficulty);
    this.lastIndex = difficulty*difficulty-1;
    var index = 0;

    //ustawienie pozycji elementów gry
    for(var i=0; i<difficulty; i++)
    {   
        for(var j=0; j<difficulty; j++)
        {
            if(index<this.lastIndex)
            {
                var component = $('<div class=component id='+index+'></div>');
                component.css({
                'background-position':(-j*this.componentSize)+"px "+(-i*this.componentSize)+"px",
                'top':i*this.componentSize,
                'left':j*this.componentSize,
                'height':this.componentSize,
                'width':this.componentSize});
                game.board.append(component); 
            }  
            this.tabPosition[index] = {top: i*this.componentSize, left:j*this.componentSize};
            index++;
        }
    }

    //Przypisanie wartości pustego elemntu
    this.emptyTop = this.tabPosition[this.lastIndex].top;
    this.emptyLeft = this.tabPosition[this.lastIndex].left;

    //wymieszanie elemntów gry
    for(var i=0; i<1000; i++)
    {
        var number = Math.floor(Math.random()*this.lastIndex);
        this.checkComponent($("#"+number));
    }

    this.start = false;

    $(".component").click(function(){
        game.checkComponent($(this));
        setTimeout("game.checkWin()", 500); 
    });

    this.resetButton.click(function(){
        game.startMenu();
    });
}

game.endGame = function()
{
    this.board.empty();
    this.board.css({'background-image': 'url("img/obraz.png")'});
}

//sprawdzenie czy kliknięty element styka się ze ścianą pustego elmentu
game.checkComponent = function(component)
{
    var componentPosition = component.position();

    if(componentPosition.top + this.componentSize == this.emptyTop && componentPosition.left == this.emptyLeft)
    {
        this.switchComponents(component, componentPosition);
    }    
    else if(componentPosition.top == this.emptyTop && componentPosition.left + this.componentSize == this.emptyLeft)
    {
        this.switchComponents(component, componentPosition);
    }
    else if(componentPosition.top == this.emptyTop + this.componentSize && componentPosition.left == this.emptyLeft)
    {
        this.switchComponents(component, componentPosition);
    }
    else if(componentPosition.top == this.emptyTop && componentPosition.left == this.emptyLeft + this.componentSize)
    {
        this.switchComponents(component, componentPosition);
    }
}

//zamiana miejscami elementów
game.switchComponents = function(component, componentPosition)
{
    if(this.start)
    {

        component.css({
            'top': this.emptyTop,
            'left': this.emptyLeft
        });
    }
    else
    {
        component.animate({
            top: this.emptyTop,
            left: this.emptyLeft
        }, 500);

        this.counter++;
        this.score.html("Turn counter: " + this.counter);
    } 

    this.emptyTop = componentPosition.top;
    this.emptyLeft = componentPosition.left;
}

//sprawdzenie czy elementy znajdują się w początkowej pozycji
game.checkWin= function()
{
    for(var i = 0; i<this.lastIndex; i++)
    {
        var current = $("#"+i).position();
        if(!(current.top == this.tabPosition[i].top && current.left == this.tabPosition[i].left))
        {
            return false;
        }
    }
    this.endGame();
}

$(document).ready(function(){

    game.startMenu();
});