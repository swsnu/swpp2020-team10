import axios from 'axios';
import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { Settings } from './Settings';
import { getMockStore } from '../test-utils/mocks';


jest.mock('axios');

const mockStore = getMockStore({});

describe('<Settings />', () => {
  let component;

  beforeEach(() => {
    component = (
      <Provider store={mockStore}>
        <Settings open={true} setOpen={() => { }} />
      </Provider>
    );

    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({
        data: {
          fridge_able: false,
          cooking_time: 0,
          rating: 0,
          calories: 0,
          diet_labels: [],
          health_labels: [],
        }
      }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('empty initial inputs', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    expect(wrapper.length).toBe(1);

    await act(async () => {
      wrapper.find('#closeSettingsButton').first().simulate('click');
    });
  });

  it('changes filter options', async () => {
    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#enableFridgeSetting').first().simulate('change');
      wrapper.find('#enableMaxCookingTimeSetting').first().simulate('change');
      wrapper.find('#enableMinRatingSetting').first().simulate('change');
      wrapper.find('#enableMaxCalorieSetting').first().simulate('change');
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#maxCookingTimeInputSetting').first().simulate('change', { target: { value: 90 } });
      wrapper.find('#minRatingInputSetting').first().simulate('change', { target: { value: 4.3 } });
      wrapper.find('#maxCalorieInputSetting').first().simulate('change', { target: { value: 400 } });
      wrapper.find('#dietLabelsInputSetting').first().simulate('change', { target: { value: 'dl1 dl2' } });
      wrapper.find('#healthLabelsInputSetting').first().simulate('change', { target: { value: 'hl1 hl2' } });
    });
    wrapper.update();
  });

  it('nonempty initial inputs', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({
        data: {
          fridge_able: true,
          cooking_time: 5,
          rating: 4,
          calories: 3,
          diet_labels: [],
          health_labels: [],
        }
      }));

    let wrapper;
    await act(async () => {
      wrapper = mount(component);
    });
    wrapper.update();

    await act(async () => {
      wrapper.find('#closeSettingsButton').first().simulate('click');
    });
  });
});