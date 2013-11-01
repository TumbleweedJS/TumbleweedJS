
define(['TW/Audio/Sound'], function(Sound) {

	module("Sound");

	test("Loop mode change tests", function() {
        var src = ['http://cdn03.hulkshare.com/dev3/0/002/703/0002703273.fid/Super_Mario_Bros__-_Coin.mp3'];
        var sound = new Sound(src);

        ok(sound.is_loop === false, "Sound loop should be false after construction");
        sound.loop();
        ok(sound.is_loop === true, "Sound loop should be true");
        sound.loop();
        ok(sound.is_loop === false, "Sound loop should be false");
        sound.loop(false);
        ok(sound.is_loop === false, "Sound loop shouldnt have change");
        sound.loop(true);
        ok(sound.is_loop === true, "Sound loop should be true");
	});

    test("Playing song without loop", function() {
        var sound = new Sound('/home/fabrice/Downloads/mario.mp3');

        sound.play();
        stop();
        setTimeout(function() {
            start();
            ok(sound.status === TW.Audio.Instance_STOPPED, "Sound should be stopped now");
        }, 1500);
    });

    test("Playing song in loop", function() {
        var sound = new Sound('/home/fabrice/Downloads/mario.mp3');

        var loop = 0;
        sound.on("loop", function(event, data, provider) {
                loop++;
            }
        );

        sound.play();
        sound.loop();
        ok(sound.is_loop === true, "Sound loop should be true");
        ok(sound.status !== TW.Audio.Instance_STOPPED, "Sound should be playing now");
        stop();
        setTimeout(function() {
            start();
            sound.loop();
            ok(sound.is_loop === false, "Sound loop should be false");
            stop();
            setTimeout(function() {
                start();
                ok(sound.status === TW.Audio.Instance_STOPPED, "Sound should be stopped now");
                ok(loop > 0, "Sound should have loop more than one time (loop = " + loop + " times)");
            }, 1500);
        }, 2500);
    });

    test("Playing multiple instances", function() {
        var sound = new Sound('/home/fabrice/Downloads/mario.mp3');
        var instance_count = 0;
        sound.on("new_instance", function(event, data, provider) {
                instance_count++;
            }
        );

        sound.play(true);
        stop();
        setTimeout(function() {
            start();
            sound.play(true);
            stop();
            setTimeout(function() {
                start();
                sound.play(true);
                ok(instance_count === 3, "3 new instances should have been catch");
                stop();
            }, 50);
        }, 50);

        setTimeout(function() {
            start();
            sound.play(true);
            ok(sound._instances.length === 3, "Reuse of stopped instances should keep the instance counter at " +
                "3 (counter = " + sound._instances.length + ")");
        }, 3000);
    });

    test("Multiple instance limitation", function() {
        var sound = new Sound('/home/fabrice/Downloads/mario.mp3');
        var instance_count = 0;

        sound.on("new_instance", function(event, data, provider) {
                instance_count++;
            }
        );

        sound.max_instances = 1;
        sound.play(true);
        sound.play(true);
        sound.play(true);

        stop();
        setTimeout(function() {
            start();
            ok(instance_count === 1, "Number of new instance should be limited to 1");
            stop();
            setTimeout(function() {
                start();
                sound.max_instances = 3;
                sound.play(true);
                sound.play(true);
                sound.play(true);
                sound.play(true);
                ok(instance_count === 3, "Number of new instance should be limited to 3");

            }, 50);

        }, 50);

    });
});
