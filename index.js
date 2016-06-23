// Modules
import React, {
  Component,
  PropTypes,
} from 'react';
import {
  InteractionManager,
} from 'react-native';
import _ from 'lodash';
import { connectMeteor } from 'react-native-meteor';

export default function(reactiveFn, Loader){
  return Component => {
    const displayName = Component.displayName || Component.name || 'Child';

    const Containerize = class extends Component {
      constructor(props){
        super(props);
        this.firstRun = true;
      }

      _ensurePerformance(reactiveFn){
        // We just need be hold on the execution for now
        // during a initial loading and a on-going Navigator scene transition
        // to avoid overloading the JS thread with too much work.
        if(this.firstRun){
          InteractionManager.runAfterInteractions(() => {
            // Calling forceUpdate will do two wanted things:
            // 1. Apply any initial data to be rendered;
            // 2. Make MeteorDataManager do its cycle calling getMeteorData
            //    in a computation.
            Trackr.afterFlush(() => this.forceUpdate(), 100);

            this.firstRun = false;
          });
        } else reactiveFn();
      }

      getMeteorData(){
        let data = {};

        this._ensurePerformance(reactiveFn.bind(null, this.props, (error, payload) => {
          data = payload;
        }));

        return data;
      }

      render(){
        const props = {
          ...this.props,
          ...this.data,
        };

        return <Component {...props}/>;
      }
    };

    Containerize.displayName = displayName;

    return connectMeteor(Containerize);
  };
}
