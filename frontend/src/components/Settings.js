import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button, Checkbox, Dimmer, Form, Loader, Modal, Segment } from 'semantic-ui-react';


export const Settings = ({ open, setOpen }) => {
  const [hasSettings, setHasSettings] = useState(false);

  // filter attributes
  const [enableFridge, setEnableFridge] = useState(false);

  const [enableMaxCookingTime, setEnableMaxCookingTime] = useState(false);
  const [maxCookingTime, setMaxCookingTime] = useState(30);
  const maxCookingTimeMaxInput = 360;

  const [enableMinRating, setEnableMinRating] = useState(false);
  const [minRating, setMinRating] = useState(2.5);

  const [enableMaxCalories, setEnableMaxCalories] = useState(false);
  const [maxCalories, setMaxCalories] = useState(500);
  const maxCaloriesMaxInput = 2000;

  const [dietLabels, setDietLabels] = useState('');
  const [healthLabels, setHealthLabels] = useState('');

  const fetchSetting = () => {
    return axios.get('/api/user/setting/')
      .then(response => {
        let {
          fridge_able,
          cooking_time,
          rating,
          calories,
          diet_labels,
          health_labels,
        } = response.data;

        if (cooking_time) {
          setMaxCookingTime(cooking_time);
        }

        if (rating) {
          setMinRating(rating);
        }

        if (calories) {
          setMaxCalories(calories);
        }

        setDietLabels(diet_labels.join(' '));
        setHealthLabels(health_labels.join(' '));

        setEnableFridge(fridge_able);
        setEnableMaxCookingTime(Boolean(cooking_time));
        setEnableMinRating(Boolean(rating));
        setEnableMaxCalories(Boolean(calories));

        return response;
      });
  };

  const saveSetting = () => {
    return axios.put('/api/user/setting/', {
      fridge_able: enableFridge ? 'true' : 'false',
      cooking_time: enableMaxCookingTime ? maxCookingTime : 0,
      rating: enableMinRating ? minRating : 0,
      calories: enableMaxCalories ? maxCalories : 0,
      diet_labels: dietLabels.split(/\s+/).filter(Boolean),
      health_labels: healthLabels.split(/\s+/).filter(Boolean),
    });
  };

  useEffect(() => {
    fetchSetting().then(() => setHasSettings(true));
  }, []);

  const filterTab = (
    <Segment>
      {
        !hasSettings &&
        <Dimmer active inverted>
          <Loader active />
        </Dimmer>
      }
      <Form>
        <Form.Field>
          <Checkbox
            id='enableFridgeSetting'
            label='Check availability from My Fridge'
            checked={enableFridge}
            onChange={() => setEnableFridge(!enableFridge)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMaxCookingTimeSetting'
            label='Set maximum cooking time'
            checked={enableMaxCookingTime}
            onChange={() => setEnableMaxCookingTime(!enableMaxCookingTime)}
          />
        </Form.Field>
        <Form.Field disabled={!enableMaxCookingTime} width={3}>
          <input
            type='number'
            id='maxCookingTimeInputSetting'
            min={1}
            max={maxCookingTimeMaxInput}
            value={maxCookingTime}
            onChange={e => setMaxCookingTime(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMinRatingSetting'
            label='Set minimum rating'
            checked={enableMinRating}
            onChange={() => setEnableMinRating(!enableMinRating)}
          />
        </Form.Field>
        <Form.Field disabled={!enableMinRating} width={3}>
          <input
            type='number'
            id='minRatingInputSetting'
            min={0.1}
            max={5}
            step={0.1}
            value={minRating}
            onChange={e => setMinRating(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMaxCalorieSetting'
            label='Set maximum calories per serving'
            checked={enableMaxCalories}
            onChange={() => setEnableMaxCalories(!enableMaxCalories)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Field disabled={!enableMaxCalories} width={3}>
            <input
              type='number'
              id='maxCalorieInputSetting'
              min={1}
              max={maxCaloriesMaxInput}
              value={maxCalories}
              onChange={e => setMaxCalories(e.target.value)}
            />
          </Form.Field>
        </Form.Field>
        <Form.Field>
          <label htmlFor='dietLabelsInputSetting'>Diet labels</label>
          <input
            type='text'
            id='dietLabelsInputSetting'
            value={dietLabels}
            onChange={e => setDietLabels(e.target.value)}
            placeholder='available:&emsp;Balanced&emsp;High-Protein&emsp;High-Fiber&emsp;Low-Fat&emsp;Low-Carb&emsp;Low-Sodium'
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor='healthLabelsInputSetting'>Health labels</label>
          <input
            type='text'
            id='healthLabelsInputSetting'
            value={healthLabels}
            onChange={e => setHealthLabels(e.target.value)}
            placeholder='others'
          />
        </Form.Field>
      </Form>
    </Segment>
  );

  return (
    <Modal
      id='settings'
      open={open}
      dimmer='inverted'
      size='small'
    >
      <Modal.Header content='Settings' />
      <Modal.Content>
        <p>Applied to both search and recommendation.</p>
        {filterTab}
      </Modal.Content>
      <Modal.Actions>
        <Button
          id='closeSettingsButton'
          onClick={() => {
            saveSetting();
            setOpen(false);
          }}
          content='Save and close'
          disabled={!hasSettings}
        />
      </Modal.Actions>
    </Modal>
  );
};