window.onload = function () {
	var segment_a = new CollisionSegment(0, 0, 0, 1);
	var segment_b = new CollisionSegment(1, 0, 1, 1);
	if (segment_a.isCollidingSegment(segment_b))
		{
			window.alert('Le segment a et le segment b rentrent en collision !');
		}
	else
	{
		window.alert('Le segment a et le segment b ne rentrent pas en collision !');
	}
}