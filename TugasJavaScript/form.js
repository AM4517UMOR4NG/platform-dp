document.getElementById("btnLanjut").addEventListener("click", function () {
    const namaInput = document.getElementById("nama");
    const jumlahInput = document.getElementById("jumlah");
    const nama = namaInput.value.trim();
    const jumlah = parseInt(jumlahInput.value);

    if (nama === "" || isNaN(jumlah) || jumlah <= 0) {
        alert("Nama dan jumlah pilihan harus diisi dengan benar!");
        return;
    }

    // Disable tombol dan input setelah ditekan
    this.setAttribute("disabled", "true");
    namaInput.setAttribute("disabled", "true");
    jumlahInput.setAttribute("disabled", "true");

    const step2 = document.getElementById("step2");
    step2.innerHTML = "<h3>Masukkan Pilihan</h3>";
    for (let i = 1; i <= jumlah; i++) {
        step2.innerHTML += `<label>Pilihan ${i} :</label> <input type="text" id="pilihan${i}" placeholder="Teks Pilihan ${i}"><br>`;
    }
    step2.innerHTML += `<button id="btnLanjut2">OK</button>`;

    document.getElementById("btnLanjut2").addEventListener("click", function () {
        const pilihan = [];
        for (let i = 1; i <= jumlah; i++) {
            const inputElem = document.getElementById(`pilihan${i}`);
            const inputVal = inputElem.value.trim();
            if (inputVal === "") {
                alert("Semua pilihan harus diisi!");
                return;
            }
            pilihan.push(inputVal);
            inputElem.setAttribute("disabled", "true"); // Disable input pilihan
        }

        // Disable tombol setelah ditekan
        this.setAttribute("disabled", "true");

        const step3 = document.getElementById("step3");
        step3.innerHTML = "<h3>Pilih Salah Satu</h3>";
        pilihan.forEach((pil, index) => {
            step3.innerHTML += `<input type="radio" name="pilihanFinal" value="${pil}"> ${pil} <br>`;
        });
        step3.innerHTML += `<button id="btnLanjut3">OK</button>`;

        document.getElementById("btnLanjut3").addEventListener("click", function () {
            const pilihanTerpilih = document.querySelector('input[name="pilihanFinal"]:checked');

            if (!pilihanTerpilih) {
                alert("Anda harus memilih salah satu!");
                return;
            }

            // Disable tombol dan radio button setelah ditekan
            this.setAttribute("disabled", "true");
            document.querySelectorAll('input[name="pilihanFinal"]').forEach(radio => {
                radio.setAttribute("disabled", "true");
            });

            const step4 = document.getElementById("step4");
            step4.innerHTML = `<h3>Hasil</h3>
                <p>Halo, nama saya <b>${nama}</b>, saya mempunyai <b>${jumlah}</b> pilihan, dan saya memilih <b>${pilihanTerpilih.value}</b>.</p>`;
        });
    });
});
