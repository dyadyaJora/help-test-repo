describe("Результаты программы, анализируем полученный dataDump", function() {
	var x = [];
	x[0] = 0;
	for (var i = 1; i <= 5; i++) {
		beforeEach(function(){
			N = 20;
			eps = 0.00000000001
			dataDump.makeCalc();
			x[i] = dataDump.inputPx[1];
		});
		it("Библиотека с тестами подключена. Запуск №" + i, function() {
			assert.equal(true, true);
		});
		it("Энтропия сообщений на входе меньше максимальной энтропии" , function() {
			assert.isBelow(dataDump.Hx, dataDump.Hmax);
		});
		it("Энтропия сообщений на входе и остаточная энтропия неотрицательные числа" , function() {
			assert.isAtLeast(dataDump.Hx, 0);
			assert.isAtLeast(dataDump.Hxy, 0);
		});
		it("Количество информации - положительное число" , function() {
			assert.isAbove(dataDump.I, 0);
		});
		it("Cумма вероятностей на входе равна 1" , function() {
			var sum = 0;
			dataDump.inputPx.forEach(function(item){
				sum+=item;
			});
			assert.equal(sum, 1);
		});
		it("Cумма вероятностей на выходе равна 1" , function() {
			var sum = 0;
			dataDump.outputPy.forEach(function(item){
				sum+=item;
			});
			assert.equal(sum, 1);
		});
		it("Программа генерирует разные значения" , function() {
			assert.notEqual(x[i-1], x[i]);
		});

		it("Вероятность безошибочного перехода - более 70%" , function() {
			for (var j = 1; j <= N ; j++) {
				assert.isAtLeast(dataDump.uslPxy[j][j], 0.7);
			}
		});
	}

});