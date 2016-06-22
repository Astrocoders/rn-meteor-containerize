# rn-meteor-containerize
A React Container component designed specially for react-native-meteor

## Why?
Containerize focus on performance, that's why it hooks up with InteractionManager to ensure that your subscriptions will just be executed when the JS thread isn't dealing with other heavy tasks.
That will ensure smooth transations for Navigator.

## Example
The syntax is made to be the same as the one of react-komposer.

```js
import composeWithtracker from 'rn-meteor-containerize'

function composer(props, onData){
  const handle = Meteor.subscribe('items') 

  if(handle.ready()){
    onData(null, {
      items: Meteor.collections('items').find({}),
    });  
  }
}

export default composeWithTracker(composer)
```
