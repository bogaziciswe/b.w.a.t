QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "startAnnotatorJS test", function( assert ) {
  assert.ok( startAnnotatorJS() == "1", "Passed!" );
});
