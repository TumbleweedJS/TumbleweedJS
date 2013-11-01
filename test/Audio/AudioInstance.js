
define(['TW/Audio/AudioInstance'], function(AudioInstance) {

	module("AudioInstance");

	test("Usage of play/pause/stop with url source", function() {
        var src = ['http://www.ilovewhat.co.uk/posts/to%20sort/Ini%20Kamoze%20-%20Here%20Comes%20The%20Hotstepper.mp3'];
        src = document.getElementById('MUSICTAG');
        var audio = new AudioInstance(src);

        ok(audio.status === TW.Audio.Instance_LOADING || audio.status === TW.Audio.Instance_STOPPED,
            "Instance should still be loading or ready and stopped");
        audio.play();
        ok(audio.status === TW.Audio.Instance_LOADING || audio.status === TW.Audio.Instance_PLAYING,
            "Instance should still be loading or playing");

        stop();

        audio.on("play", function() {
            start();
            ok(audio.status === TW.Audio.Instance_PLAYING, "Play event received, instance should be playing");

            stop();

            setTimeout(function() {
                start();

                var pos = audio.getPosition();
                audio.pause();
                ok(audio.status === TW.Audio.Instance_PAUSED, "Instance shoud be paused");

                ok(pos !== 0, "Position should be different than 0: pos = " + pos);
                ok(audio.getPosition() - pos < 0.01, "Position should be the same before and after pause");

                audio.play();
                ok(audio.status === TW.Audio.Instance_PLAYING, "Instance should be playing again, no play event: OK");

                audio.stop();
            }, 1500);
        });

        audio.on("stop", function() {
            ok(audio.status === TW.Audio.Instance_STOPPED, "Stop event received, instance should be stopped");

            ok(audio.getPosition() === 0, "Position should be 0");
        });

	});

	test("play a corrumpted file", function() {



		ok(true);
		/*
		We need a corrumpted file.

		This test should use the `error` event.
		 */
	});

	test("use getDuration() and moves current position", function() {
		ok(true);
		/*
		This test should use:

		- getDuration() -- test with a known duration
		- getPosition() and setPosition()

		- event error and status error with a bad position

		We need a music file for tests.
		*/
	});

	test("mute and unmute", function() {
		var audio = new AudioInstance(
            'http://www.ilovewhat.co.uk/posts/to%20sort/Ini%20Kamoze%20-%20Here%20Comes%20The%20Hotstepper.mp3'
        );

		ok(!audio.isMuted(), "instance should be unmuted by default");
		audio.mute(false);
		ok(!audio.isMuted(), "should be unmuted after mute(false)");
		audio.mute(true);
		ok(audio.isMuted(), "should be mute after mute()");

		audio.mute();
		audio.mute();
		ok(audio.isMuted(), "After to call to mute() whitout argument, should be in the same state");

		audio.mute(false);
		audio.mute();
		ok(audio.isMuted(), "Should be mute ...");
		audio.mute();
		ok(audio.isMuted(), "... and unmute");

	});

	test("volume change test", function() {
        var audio = new AudioInstance(
            'http://www.ilovewhat.co.uk/posts/to%20sort/Ini%20Kamoze%20-%20Here%20Comes%20The%20Hotstepper.mp3'
        );

		equal(audio.getVolume(), 100, "Default volume should be 100 -- TODO ? d?finir");
		audio.setVolume(0);
		equal(audio.getVolume(), 0, "volume set to 0");

		audio.setVolume(56);
		equal(audio.getVolume(), 56, "volume set to 56");

		audio.setVolume(120);
		equal(audio.getVolume(), 100, "volume should not be more than 100");

		audio.setVolume(1);
		equal(audio.getVolume(), 1, "volume set to 1");

		audio.setVolume(-33);
		equal(audio.getVolume(), 0, "volume should not be less than 0");
	});
});
