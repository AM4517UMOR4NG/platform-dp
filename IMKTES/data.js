// data.js
const stories = {
    "petualangan-hutan": {
        title: "Petualangan di Hutan",
        illustration: "🌳",
        content: [
            { text: "Kiki pergi ke hutan bersama ayahnya.", choices: [
                { text: "Jalan kaki", next: "jalan-kaki" },
                { text: "Naik mobil", next: "naik-mobil" }
            ]},
            { text: "Di hutan, Kiki melihat kupu-kupu yang cantik.", choices: [] }
        ]
    }
};

const gameConfigs = {
    sentence: {
        easy: {
            words: ["Kiki", "berjalan", "ke", "hutan"],
            correct: ["Kiki", "berjalan", "ke", "hutan"]
        },
        medium: {
            words: ["Kiki", "melihat", "kupu-kupu", "di", "hutan"],
            correct: ["Kiki", "melihat", "kupu-kupu", "di", "hutan"]
        }
    },
    memory: {
        easy: [
            { word: "bunga", image: "🌸" },
            { word: "kupu", image: "🦋" }
        ]
    }
};

const definitions = {
    "kupu-kupu": {
        definition: "Serangga bersayap berwarna",
        example: "Kupu-kupu hinggap di bunga."
    },
    "bunga": {
        definition: "Bagian tanaman yang indah",
        example: "Bunga mawar harum sekali."
    }
};

const translations = {
    id: {
        startAdventure: "Mulai Petualangan",
        selectProfile: "Pilih Profil",
        home: "Beranda",
        library: "Perpustakaan",
        read: "Baca",
        activities: "Aktivitas",
        progress: "Progres",
        createStory: "Buat",
        correct: "Hebat! Kalimat Anda benar! 🎉",
        incorrect: "Coba Lagi! Susun kata-kata dengan urutan yang tepat.",
        dashboard: "Dashboard",
        createProfile: "Buat Profil Baru",
        save: "Simpan",
        cancel: "Batal"
    }
};