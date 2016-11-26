function DataClean(){
	this.a = 10;
}

function DataInterference(){
	this.a = 10;
}

DataInterference.prototype = Object.create(DataClean.prototype);

DataClean.prototype._generateInputValue = function(){
	var a = [], 
		b = 1,
		aSum = 0;
	for (var i = 1; i < N; i++) {
		a[i] = b* Math.random();
		a[i] = a[i] <= 0? eps : a[i];
		b-= a[i];
		aSum+=a[i];
	}
	a[N] = 1 - aSum;
	a[N] = a[N] <= 0? eps : a[N];
	return a;
};


DataClean.prototype._calculateH = function(){
	return this._calculateHx();
};

DataClean.prototype._calculateHx = function(){
	var Hx = 0;
	this.inputPx.forEach(function(item){
		Hx += item * Math.log2(item);
	});
	return -Hx;
};

DataClean.prototype._calculateTTx = function(){
	var tx = 0;
	var self = this;
	this.inputPx.forEach(function(item, i){
		tx += item * self.inputTx[i];
	});
	return tx;
};

DataClean.prototype._calculateII = function(){
	this.H = this._calculateH();
	this.tx = this._calculateTTx();
	return this.H / this.tx;
};

DataClean.prototype._calculateC = function(){
	return Math.log2(N) / this.tx;
};


DataClean.prototype.makeCalc = function() {
	this.inputPx = this._generateInputValue();
	this.inputTx = this._generateInputValue();
	this.II = this._calculateII();
	this.C = this._calculateC();
};