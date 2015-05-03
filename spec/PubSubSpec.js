describe("PubSub", function() {
  var messenger, callback, topic, data;
  topic = 'topic';
  data = {'A': 1, 'B': 2};

  beforeEach(function() {
    messenger = new PubSub();
    callback = jasmine.createSpy('callback');
  });

  it("should register subscribers", function() {
    messenger.register(topic, callback);
    expect(Object.keys(messenger.topics).length).toBe(1);
  });

  it("should unregister subscribers", function() {
    var subscription = messenger.register(topic, callback);
    subscription.remove();
    expect(messenger.topics[topic][0]).toBeUndefined();
  });

  it("should publish to subscribers", function() {
    var subscription = messenger.register(topic, callback);
    expect(callback.calls.count()).toEqual(0);
    messenger.send(topic, data);
    expect(callback.calls.count()).toEqual(1);
    expect(callback).toHaveBeenCalledWith(data);
  });
});
