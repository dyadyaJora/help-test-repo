var dataDump = {};

dataDump.generateInputPx = function(){
	var p = [], 
		b = 1,
		pSum = 0;
	for (var i = 1; i < N; i++) {
		p[i] = b* Math.random();
		p[i] = p[i] <= 0? eps : p[i];
		b-= p[i];
		pSum+=p[i];
	}
	p[N] = 1 - pSum;
	p[N] = p[N] <= 0? eps : p[N];
	this.inputPx = p;
};

dataDump.generateUslownayaPxy = function(){
	var p = [],
		b,
		pSum = 0;
	for (var i = 1; i <= N; i++) {
		p[i] = [];
		p[i][i] = 0.7 + 0.3 * Math.random();
		b = 1 - p[i][i];
		pSum = p[i][i];
		for (var j = 1; j < N; j++) {
			if(i != j) {
				p[i][j] = b * Math.random();
				//костыль связанный с погрешностью вычислений и вероятностью 0
				p[i][j] = p[i][j] <= 0 ? eps : p[i][j];
				//
				b -= p[i][j];
				pSum += p[i][j];
			}
		}
		if(i!=N){
			p[i][N] = 1 - pSum;
			p[i][N] = p[i][N] <= 0 ? eps : p[i][N]
		}
	}
	this.uslPxy = p;
};

dataDump.generateOutputPy = function(){
	var p = [];
	for (var j = 1; j <= N; j++) {
		p[j] = 0;
		for (var i = 1; i <= N; i++) {
			p[j] += this.inputPx[i] * this.uslPxy[i][j];
		}
	}
	this.outputPy = p;
};

dataDump.generateSowmestnayaPxy = function(){
	var px = this.inputPx, a; 
	this.sowmPxy = [];
	for (var i = 1; i <= N; i++) {
		this.sowmPxy[i] = [];
		for (var j = 1; j <= N; j++) {
			this.sowmPxy[i][j] = this.outputPy[j] * this.uslPxy[i][j];
		}
	}
};

dataDump.calculateHx = function(){
	var Hx = 0;
	this.inputPx.forEach(function(item){
		Hx += item * Math.log2(item);
	});
	this.Hx = this.H = -Hx;
};

dataDump.calculateHmax = function(){
	this.Hmax =  Math.log2(N);
};

dataDump.calculateHxy = function(){
	var Hxy = 0;
	for (var i = 1; i <= N; i++) {
		for (var j = 1; j <= N; j++) {
			Hxy += this.sowmPxy[i][j] * Math.log2(this.uslPxy[i][j]);
		}
	}
	this.Hxy = -Hxy;
};

dataDump.calculateI = function(){
	this.I = this.Hx - this.Hxy;
};

dataDump.makeCalc = function(){
	dataDump.generateInputPx();
	dataDump.generateUslownayaPxy();
	dataDump.generateOutputPy();
	dataDump.generateSowmestnayaPxy();
	dataDump.calculateHx();
	dataDump.calculateHmax();
	dataDump.calculateHxy();
	H = this.Hx;
	this.Hx = this.Hx < this.Hxy ? this.Hxy : H;
	this.Hxy = H < this.Hxy ? H : this.Hxy;
	dataDump.calculateI();
};