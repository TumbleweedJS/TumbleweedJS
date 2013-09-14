
define(['TW/Audio/JukeBox', 'TW/Audio/Sound'], function(JukeBox, Sound) {

    module("JukeBox");

    test("Add, rm, get, getCurrent", function() {
        var box = new JukeBox();
        var s1 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var s2 = new Sound('/home/fabrice/Downloads/mario.mp3');
        var s3 = new Sound('/home/fabrice/Downloads/mario.mp3');

        stop();
        setTimeout(function() {
            start();
            ok(box._sounds.length === 0, "JukeBox should be empty");

            box.add("s1", s1);
            ok(box._sounds.length === 1, "JukeBox should contain 1 sound");
            ok(box.get("s1") === s1, "Get S1");
            ok(box.getCurrent() === s1, "Current sound should be the only one (s1)");

            box.add("s2", s2);
            ok(box._sounds.length === 2, "JukeBox should contain 2 sounds");
            ok(box.get("s1") === s1, "Get S1");
            ok(box.get("s2") === s2, "Get S2");
            ok(box.getCurrent() === s1, "Current sound should be s1");
            box.next();
            box.pause();
            ok(box.getCurrent() === s2, "Current sound should be s2");
            box.next();
            ok(box.getCurrent() === s1, "Current sound should be s1 " + box._current);

            box.rm("s1");
            ok(box.get("s1") === false, "S1 should not exist anymore in the JukeBox");
            ok(box.getCurrent() === s2, "Current sound should be s2");

            box.rm("s2");
            ok(box.get("s2") === false, "S2 should not exist anymore in the JukeBox");
            ok(box.getCurrent() === false, "No current sound, pool is empty");

            box.play();
            ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
            box.pause();
            ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");

            box.add("s1", s1);
            box.play();
            ok(box.status === TW.Audio.JukeBox_PLAYING, "JukeBox should be playing");
            box.pause();
            ok(box.status === TW.Audio.JukeBox_PAUSED, "JukeBox should be paused");
            box.play();
            ok(box.status === TW.Audio.JukeBox_PLAYING, "JukeBox should be playing");
            box.stop();
            ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
        }, 100);
    });

	test("Play, Pause, Stop without sound", function() {
        var box = new JukeBox();
        box.stop();
        ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
        box.pause();
        ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
        box.play();
        ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
        box.stop();
        ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
        box.pause();
        ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
        box.play();
        ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
        box.pause();
        ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
        box.stop();
        ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
    });

    test("Play, Pause, Stop sounds in loop", function() {
        var box = new JukeBox();
        var sound = new Sound('/home/fabrice/Downloads/mario.mp3');
        box.add("mario", sound);
        sound = new Sound('/home/fabrice/Downloads/mario1.mp3');
        box.add("mario", sound);
        sound = new Sound('/home/fabrice/Downloads/mario4.mp3');
        box.add("mario4", sound);
        sound = new Sound('/home/fabrice/Downloads/mario5.mp3');
        box.add("mario5", sound);

        stop();
        setTimeout(function() {
            start();
            box.stop();
            ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
            box.pause();
            ok(box.status === TW.Audio.JukeBox_PAUSED, "JukeBox should be paused");

            box.play();
            box.loop = true;
            box.random = true;
            stop();

            setTimeout(function() {
                start();
                ok(box.status === TW.Audio.JukeBox_PLAYING, "JukeBox should be playing now");

                box.pause();
                ok(box.status === TW.Audio.JukeBox_PAUSED, "JukeBox should be paused");

                box.stop();
                ok(box.status === TW.Audio.JukeBox_STOPPED, "JukeBox should be stopped");
            }, 5000);
        }, 100);

    });

    test("SetVolume, Mute", function() {
        var box = new JukeBox();
        var sound = new Sound('/home/fabrice/Downloads/mario.mp3');
        box.add("mario", sound);

        stop();
        setTimeout(function() {
            start();
            ok(box.getVolume() === 100, "JukeBox volume should be 100");
            box.setVolume(50);
            ok(box.getVolume() === 50, "JukeBox volume should be 50");
            ok(sound.getVolume() === 100, "Sound volume should be 100");
            box.play("mario");
            ok(sound.getVolume() === 50, "Sound volume should be 50");
        }, 100);
    });

    test("Events tests", function() {
        var box = new JukeBox();
        box.add("s1", new Sound('/home/fabrice/Downloads/mario.mp3'));
        box.add("s2", new Sound('/home/fabrice/Downloads/mario1.mp3'));
        box.add("s3", new Sound('/home/fabrice/Downloads/mario5.mp3'));

        var nb_next_track = 0;
        var nb_stop = 0;

        box.on("next_track", function() {
            nb_next_track++;
        });
        box.on("stop", function() {
            nb_stop++;
        });

        box.play();
        stop();
        setTimeout(function() {
            start();
            ok(nb_next_track === 2, "2 next_track event emit");
            ok(nb_stop === 1, "1 stop event emit");
        }, 5000);
    });
 });
