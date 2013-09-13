
define(['TW/Audio/Manager', 'TW/Audio/Sound'], function(Manager, Sound) {

    module("Sound");
    module("Manager");


    test("SetVolume", function() {
        var sound1 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var sound2 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var sound3 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var sound4 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var manager = new Manager();
        manager.add(sound1);
        manager.add(sound2);
        manager.add(sound3);
        manager.add(sound4);
        sound1.setVolume(100);
        sound2.setVolume(80);
        sound3.setVolume(50);
        sound4.setVolume(0);

        manager.setVolume(100);
        ok(sound1.getVolume() === 100, "Sound1 volume should be 100");
        ok(sound2.getVolume() === 80, "Sound2 volume should be 80");
        ok(sound3.getVolume() === 50, "Sound3 volume should be 50");
        ok(sound4.getVolume() === 0, "Sound4 volume should be 0");

        manager.setVolume(50);
        ok(sound1.getVolume() === 50, "Sound1 volume should be 50");
        ok(sound2.getVolume() === 40, "Sound2 volume should be 40");
        ok(sound3.getVolume() === 25, "Sound3 volume should be 25");
        ok(sound4.getVolume() === 0, "Sound4 volume should be 0");

        manager.setVolume(70);
        ok(sound1.getVolume() === 70, "Sound1 volume should be 70");
        ok(sound2.getVolume() === 56, "Sound2 volume should be 56");
        ok(sound3.getVolume() === 35, "Sound3 volume should be 35");
        ok(sound4.getVolume() === 0, "Sound4 volume should be 0");

        manager.setVolume(0);
        ok(sound1.getVolume() === 0, "Sound1 volume should be 0");
        ok(sound2.getVolume() === 0, "Sound2 volume should be 0");
        ok(sound3.getVolume() === 0, "Sound3 volume should be 0");
        ok(sound4.getVolume() === 0, "Sound4 volume should be 0");
    });

    test("Add / rm / has", function() {
        var sound1 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var sound2 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var sound3 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var manager = new Manager();

        ok(manager._sounds.length === 0, "Manager should contain 0 sounds");
        manager.add(sound1);
        ok(manager._sounds.length === 1, "Manager should contain 1 sounds");

        manager.add(sound2);
        manager.add(sound3);
        ok(manager._sounds.length === 3, "Manager should contain 3 sounds");

        ok(manager.has(sound1) === true, "Manager should contain sound1");
        manager.rm(sound1);
        ok(manager._sounds.length === 2, "Manager should contain 2 sounds");
        ok(manager.has(sound1) === false, "Manager should not contain sound1");

        manager.rm(sound1);
        manager.rm(sound1);
        manager.rm(sound1);
        ok(manager._sounds.length === 2, "Manager should contain 2 sounds");
        ok(manager.has(null) === false, "Manager should not contain null");

    });

    test("Resume / pause / stop Sounds", function() {
        var sound1 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var sound2 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var sound3 = new Sound('/home/fabrice/Downloads/mario.mp3');

        var manager = new Manager();
        manager.add(sound1);
        manager.add(sound2);
        manager.add(sound3);
        stop();

        setTimeout(function() {
            start();
            sound1.pause();
            sound2.pause();
            sound3.stop();
            manager.resume();
            var cnt = 0;
            for (var i = 0; i < manager._sounds.length; i++) {
                if (manager._sounds[i].status === TW.Audio.Instance_PLAYING) {
                    cnt++;
                }
            }
            ok(cnt === 2, "Only 2/3 instances should be playing (" + cnt + ")");

            manager.pause();
            cnt = 0;
            for (i = 0; i < manager._sounds.length; i++) {
                if (manager._sounds[i].status === TW.Audio.Instance_PAUSED) {
                    cnt++;
                }
            }
            ok(cnt === 2, "Only 2/3 instances should be paused (" + cnt + ")");

            manager.stop();
            cnt = 0;
            for (i = 0; i < manager._sounds.length; i++) {
                if (manager._sounds[i].status === TW.Audio.Instance_STOPPED) {
                    cnt++;
                }
            }
            ok(cnt === 3, "3/3 instances should be paused (" + cnt + ")");
        }, 50);
	});


});
