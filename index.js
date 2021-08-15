var __queue;
Wait.setup();
window.noSmooth();
World.frameRate = 60;
var board = [
  [0xa, 0x8, 0x9, 0xb, 0xc, 0x9, 0x8, 0xa],
  [0x7, 0x7, 0x7, 0x7, 0x7, 0x7, 0x7, 0x7],
  [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
  [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
  [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
  [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0],
  [0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1],
  [0x4, 0x2, 0x3, 0x5, 0x6, 0x3, 0x2, 0x4],
];
createSprite(200, 200).setAnimation("board");
World.allSprites[0].scale = 10;
var pieces = [];
for(var i = 0; i < 2; i++) {
  for(var j = 0; j < 8; j++) {
    pieces.push(createSprite(25 + 50 * j, 25 + i * 50));
    pieces[pieces.length - 1].setAnimation("piece_" + board[i][j]);
    pieces[pieces.length - 1].scale = 5;
    pieces.push(createSprite(25 + 50 * j, 325 + i * 50));
    pieces[pieces.length - 1].setAnimation("piece_" + board[i + 6][j]);
    pieces[pieces.length - 1].scale = 5;
  }
}
var turn = 0;
var mousePos = {x: 0, y: 0};
var possibleMoves = [];
var pieceMoving = {};
var castling = [true, true];
var gameOver = false;
function isOpen(r, c) {
  return (
    r > -1 &&
    r < 8 &&
    c > -1 &&
    c < 8 &&
    (!board[r][c] || turn ^ (board[r][c] > 6))
  );
}

function canMove() {
  return (
    board[mousePos.y][mousePos.x] &&
    turn ^ (board[mousePos.y][mousePos.x] < 7)
  );
}

function getMoves() {
  return [
    null,
    
    function() {
      var ret = [];
      if(!board[mousePos.y - 1][mousePos.x]) {
        ret.push({x: mousePos.x, y: mousePos.y - 1});
      }
      if(mousePos.y == 6 && !board[mousePos.y - 2][mousePos.x]) {
        ret.push({
          x: mousePos.x, 
          y: mousePos.y - 2
        });
      }
      if(board[mousePos.y - 1][mousePos.x + 1] > 6) {
        ret.push({
          x: mousePos.x + 1, 
          y: mousePos.y - 1
        });
      }
      if(board[mousePos.y - 1][mousePos.x - 1] > 6) {
        ret.push({
          x: mousePos.x - 1, 
          y: mousePos.y - 1
        });
      }
      return ret;
    },
    
    
    function() {
      var ret = [];
      for(var i = 0; i < 4; i++) {
        var o = [[-2, -1, 1, 2][i]];
        o[1] = Math.abs(o[0]) == 2 ? 1 : 2;
        if(board[mousePos.x + o[0]]) {
          ret.push({
            x: mousePos.x + o[0], 
            y: mousePos.y + o[1]});
        }
        if(board[mousePos.x + o[0]]) {
          ret.push({
            x: mousePos.x + o[0], 
            y: mousePos.y - o[1]});
        }
      }
      return ret;
    },
    
    
    function() {
      var ret = [];
      var d = [mousePos.y + 1, mousePos.x + 1];
      while (isOpen(d[0], d[1])) {
        ret.push({x: d[1], y: d[0]});
        if(board[d[0]][d[1]]) {
          break;
        }
        d[0]++;
        d[1]++;
      }
      d = [mousePos.y + 1, mousePos.x - 1];
      while (isOpen(d[0], d[1])) {
        ret.push({x: d[1], y: d[0]});
        if(board[d[0]][d[1]]) {
          break;
        }
        d[0]++;
        d[1]--;
      }
      d = [mousePos.y - 1, mousePos.x + 1];
      while (isOpen(d[0], d[1])) {
        ret.push({x: d[1], y: d[0]});
        if(board[d[0]][d[1]]) {
          break;
        }
        d[0]--;
        d[1]++;
      }
      d = [mousePos.y - 1, mousePos.x - 1];
      while (isOpen(d[0], d[1])) {
        ret.push({x: d[1], y: d[0]});
        if(board[d[0]][d[1]]) {
          break;
        }
        d[0]--;
        d[1]--;
      }
      return ret;
    },
    
    
    function() {
      var ret = [];
      var d = mousePos.y + 1;
      while (isOpen(d, mousePos.x)) {
        ret.push({x: mousePos.x, y: d});
        if(board[d][mousePos.x]) {
          break;
        }
        d++;
      }
      d = mousePos.y - 1;
      while (isOpen(d, mousePos.x)) {
        ret.push({x: mousePos.x, y: d});
        if(board[d][mousePos.x]) {
          break;
        }
        d--;
      }
      d = mousePos.x + 1;
      while (isOpen(mousePos.y, d)) {
        ret.push({x: d, y: mousePos.y});
        if(board[mousePos.y][d]) {
          break;
        }
        d++;
      }
      d = mousePos.x - 1;
      while (isOpen(mousePos.y, d)) {
        ret.push({x: d, y: mousePos.y});
        if(board[mousePos.y][d]) {
          break;
        }
        d--;
      }
      return ret;
    },
    
    
    function() {
      var ret = this[3]();
      return ret.concat(this[4]());
    },
    
    
    function() {
      var ret = [];
      for(var i = -1; i < 2; i++) {
        for(var j = -1; j < 2; j++) {
          if((i || j) && isOpen(mousePos.y + i, mousePos.x + j)) {
            ret.push({x: mousePos.x + j, y: mousePos.y + i});
          }
        }
      }
      if(castling[turn] && !board[mousePos.y][mousePos.x - 1]) {
        ret.push({x: mousePos.x - 2, y: mousePos.y});
      }
      return ret;
    },
    
    
    function() {
      var ret = [];
      if(!board[mousePos.y + 1][mousePos.x]) {
        ret.push({x: mousePos.x, y: mousePos.y + 1});
      }
      if(mousePos.y == 1 && !board[mousePos.y + 2][mousePos.x]) {
        ret.push({x: mousePos.x, y: mousePos.y + 2});
      }
      if(
        board[mousePos.y + 1][mousePos.x + 1] &&
        board[mousePos.y + 1][mousePos.x + 1] < 7
      ) {
        ret.push({x: mousePos.x + 1, y: mousePos.y + 1});
      }
      if(
        board[mousePos.y + 1][mousePos.x - 1] &&
        board[mousePos.y + 1][mousePos.x - 1] < 7
      ) {
        ret.push({x: mousePos.x - 1, y: mousePos.y + 1});
      }
      return ret;
    },
    
    
    function() {
      return this[2]();
    },
    
    
    function() {
      return this[3]();
    },
    
    
    function() {
      return this[4]();
    },
    
    
    function() {
      return this[5]();
    },
    
    
    function() {
      return this[6]();
    }
  ][board[mousePos.y][mousePos.x]]();
}

function draw() {
  if(World.frameCount == 1 && window.getURLPath()[2] != "W0zF4abT7hp6A5hBi-fGPkSr9HCPuFXZwgJ_PZKUwI0") {
    prompt("This is a stolen version of the game.\nThe original is https://studio.code.org/projects/gamelab/W0zF4abT7hp6A5hBi-fGPkSr9HCPuFXZwgJ_PZKUwI0/");
  }
  
  
  mousePos = {
    x: Math.round((mouseX - 25) / 50),
    y: Math.round((mouseY - 25) / 50),
  };
  
  
  if(mouseWentDown("leftButton") && !__queue.length && !gameOver) {
    if(!possibleMoves.length) {
      if(canMove()) {
        possibleMoves = getMoves();
        possibleMoves = possibleMoves.filter(function(m) {
          return isOpen(m.y, m.x);
        });
        pieceMoving = {
          piece: null,
          pieceNum: 0,
          start: {x: mousePos.x, y: mousePos.y},
        };
        for(var i in pieces) {
          if((pieces[i].x - 25) / 50 == mousePos.x &&(pieces[i].y - 25) / 50 == mousePos.y) {
            pieceMoving.piece = pieces[i];
            pieceMoving.pieceNum = i;
            return;
          }
        }
      }
    } else if(possibleMoves.some(function(m) {
        return m.x == mousePos.x && m.y == mousePos.y;
      })) {
      pieceMoving.dist = {
        x: mousePos.x - pieceMoving.start.x,
        y: mousePos.y - pieceMoving.start.y,
      };
      
      Wait.frame(
        20, function() {
          for(var i in pieces) {
            if(i != pieceMoving.pieceNum && pieces[i].x == (pieceMoving.start.x + pieceMoving.dist.x) * 50 + 25 && pieces[i].y == (pieceMoving.start.y + pieceMoving.dist.y) * 50 + 25) {
              pieces[i].x -= 500;
              pieces[i].destroy();
            }
          }
          if(castling[turn]) {
            if(board[pieceMoving.start.y][pieceMoving.start.x] % 6 == 4) {
              castling[turn] = false;
            }
            if(board[pieceMoving.start.y][pieceMoving.start.x] % 6 == 0) {
              if(pieceMoving.dist.x == -2) {
                board[pieceMoving.start.y + pieceMoving.dist.y][pieceMoving.start.x + pieceMoving.dist.x] = board[pieceMoving.start.y][pieceMoving.start.x];
                board[pieceMoving.start.y][pieceMoving.start.x] = 0;
                
                for(var j = 0; j < pieces.length; j++) {
                  if(pieces[j].x == 25 && pieces[j].y == (turn ? 25 : 375)) {
                    pieceMoving = {
                      piece: pieces[j],
                      pieceNum: 0,
                      start: {
                        x: 0,
                        y: (pieces[j].y - 25) / 50
                      },
                      dist: {
                        x: 2, 
                        y: 0
                      }
                    };
                  }
                }
                Wait.frame(
                  20, function() {
                    board[pieceMoving.start.y + pieceMoving.dist.y][pieceMoving.start.x + pieceMoving.dist.x] = board[pieceMoving.start.y][pieceMoving.start.x];
                    board[pieceMoving.start.y][pieceMoving.start.x] = 0;
                    pieceMoving = {};
                    possibleMoves = [];
                    turn = +!turn;
                  },
                  function() {
                    var s = cos(__queue[0].frames * 9 - 9) * 25;
                    pieceMoving.piece.x = pieceMoving.start.x * 50 + 25 + pieceMoving.dist.x * 25 + pieceMoving.dist.x * s;
                    pieceMoving.piece.y = pieceMoving.start.y * 50 + 25 + pieceMoving.dist.y * 25 + pieceMoving.dist.y * s;
                  }
                );
                castling[turn] = false;
                return;
              }
              castling[turn] = false;
            }
            if(!pieceMoving.start.x && pieceMoving.start.y % 7 == 0) {
              castling[turn] = false;
            }
          }
          
          
          if(board[pieceMoving.start.y + pieceMoving.dist.y][pieceMoving.start.x + pieceMoving.dist.x] &&board[pieceMoving.start.y + pieceMoving.dist.y][pieceMoving.start.x + pieceMoving.dist.x] % 6 == 0) {
            prompt((turn ? "Black" : "White") + " wins!");
            gameOver = true;
          }
          board[pieceMoving.start.y + pieceMoving.dist.y][pieceMoving.start.x + pieceMoving.dist.x] = board[pieceMoving.start.y][pieceMoving.start.x];
          
          if(board[pieceMoving.start.y + pieceMoving.dist.y][pieceMoving.start.x + pieceMoving.dist.x] % 6 == 1 && (pieceMoving.start.y + pieceMoving.dist.y) % 7 == 0) {
            board[pieceMoving.start.y + pieceMoving.dist.y][pieceMoving.start.x + pieceMoving.dist.x] += 4;
            pieceMoving.piece.setAnimation("piece_" + (turn ? 11 : 5));
          }
          board[pieceMoving.start.y][pieceMoving.start.x] = 0;
          pieceMoving = {};
          possibleMoves = [];
          turn = +!turn;
        },
        function() {
          var s = cos(__queue[0].frames * 9 - 9) * 25;
          pieceMoving.piece.x = pieceMoving.start.x * 50 + 25 + pieceMoving.dist.x * 25 + pieceMoving.dist.x * s;
          pieceMoving.piece.y = pieceMoving.start.y * 50 + 25 + pieceMoving.dist.y * 25 + pieceMoving.dist.y * s;
        }
      );
    }
  }
  
  drawSprites();
  
  if(pieceMoving.dist) {
    window.drawSprite(pieceMoving.piece);
  } else {
    stroke("#F00");
    strokeWeight(5);
    noFill();
    for(var j = 0; j < possibleMoves.length; j++) {
      rect(possibleMoves[j].x * 50 + 2, possibleMoves[j].y * 50 + 2, 45);
    }
  }
  Wait.loop();
}
