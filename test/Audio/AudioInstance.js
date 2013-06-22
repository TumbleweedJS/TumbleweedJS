
define(['TW/Audio/AudioInstance'], function(AudioInstance) {

	module("AudioInstance");

	test("Usage of play/pause/stop", function() {
		ok(true);
		/*
		This test should use:

		- play()
		- pause()
		- stop()
		- the `status` attribute.

		- event play (after the file is loading)
		- event stop

		//when the music is ended: (/!\ tests must be fast !)
		equal(audio.getPosition(), audio.getDuration(), "the final position should be the duration of the track.");
		*/
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
		var audio = new AudioInstance();

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
		var audio = new AudioInstance();

		equal(audio.getVolume(), 100, "Default volume should be 100 -- TODO à définir");
		audio.setVolume(0);
		equal(audio.setVolume(), 0, "volume set to 0");

		audio.setVolume(56);
		equal(audio.getVolume(), 0, "volume set to 0");

		audio.setVolume(120);
		equal(audio.getVolume(), 100, "volume should not be more than 100");

		audio.setVolume(1);
		equal(audio.getVolume(), 1, "volume set to 1");

		audio.setVolume(-33);
		equal(audio.getVolume(), 0, "volume should not be less than 0");
	});
});
