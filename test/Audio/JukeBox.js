
define(['TW/Audio/JukeBox', 'TW/Audio/Sound'], function(JukeBox, Sound) {

    module("JukeBox");

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

    test("Play, Pause, Stop with one sound in loop", function() {
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
            }, 30000);
        }, 100);

    });
});
