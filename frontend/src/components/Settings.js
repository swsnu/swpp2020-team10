import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button, Checkbox, Form, Loader, Modal, Segment } from 'semantic-ui-react';


export const Settings = ({ open, onClose }) => {
  const [hasSettings, setHasSettings] = useState(false);

  // filter attributes
  const [enableFridge, setEnableFridge] = useState(false);

  const [enableMaxCookingTime, setEnableMaxCookingTime] = useState(false);
  const [maxCookingTime, setMaxCookingTime] = useState(30);
  const maxCookingTimeMaxInput = 360;

  const [enableMinRating, setEnableMinRating] = useState(false);
  const [minRating, setMinRating] = useState(2.5);

  const [enableMaxCalorie, setEnableMaxCalorie] = useState(false);
  const [maxCalorie, setMaxCalorie] = useState(500);
  const maxCalorieMaxInput = 2000;

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

        if (fridge_able) {
          setEnableFridge(true);
        }

        if (cooking_time) {
          setEnableMaxCookingTime(true);
          setMaxCookingTime(cooking_time);
        }
        if (rating) {
          setEnableMinRating(true);
          setMinRating(rating);
        }
        if (calories) {
          setEnableMaxCalorie(true);
          setMaxCalorie(calories);
        }
        if (diet_labels.length) {
          setDietLabels(diet_labels.join(' '));
        }
        if (health_labels.length) {
          setHealthLabels(health_labels.join(' '));
        }

        return response;
      });
  };

  const saveSetting = () => {
    return axios.put('/api/user/setting/', {
      fridge_able: enableFridge ? 'true' : 'false',
      cooking_time: enableMaxCookingTime ? maxCookingTime : 0,
      rating: enableMinRating ? minRating : 0,
      calories: enableMaxCalorie ? maxCalorie : 0,
      diet_labels: dietLabels.split(/\s+/).filter(Boolean),
      health_labels: healthLabels.split(/\s+/).filter(Boolean),
    });
  };

  useEffect(() => {
    fetchSetting().finally(() => setHasSettings(true));
  }, []);

  const filterTab = (
    <Segment>
      <Form>
        <Form.Field>
          <Checkbox
            id='enableFridge'
            label='Check availability from My Fridge'
            checked={enableFridge}
            onChange={() => setEnableFridge(!enableFridge)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMaxCookingTime'
            label='Set maximum cooking time'
            checked={enableMaxCookingTime}
            onChange={() => setEnableMaxCookingTime(!enableMaxCookingTime)}
          />
        </Form.Field>
        <Form.Field disabled={!enableMaxCookingTime} width={3}>
          <input
            type='number'
            id='maxCookingTimeInput'
            min={0}
            max={maxCookingTimeMaxInput}
            value={maxCookingTime}
            onChange={e => setMaxCookingTime(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMinRating'
            label='Set minimum rating'
            checked={enableMinRating}
            onChange={() => setEnableMinRating(!enableMinRating)}
          />
        </Form.Field>
        <Form.Field disabled={!enableMinRating} width={3}>
          <input
            type='number'
            id='minRatingInput'
            min={0}
            max={5}
            step={0.1}
            value={minRating}
            onChange={e => setMinRating(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            id='enableMaxCalorie'
            label='Set maximum calories per serving'
            checked={enableMaxCalorie}
            onChange={() => setEnableMaxCalorie(!enableMaxCalorie)}
          />
        </Form.Field>
        <Form.Field>
          <Form.Field disabled={!enableMaxCalorie} width={3}>
            <input
              type='number'
              id='maxCalorieInput'
              min={0}
              max={maxCalorieMaxInput}
              value={maxCalorie}
              onChange={e => setMaxCalorie(e.target.value)}
            />
          </Form.Field>
        </Form.Field>
        <Form.Field>
          <label htmlFor='dietLabelsInput'>Diet labels</label>
          <input
            type='text'
            id='dietLabelsInput'
            value={dietLabels}
            onChange={e => setDietLabels(e.target.value)}
            placeholder='available:&emsp;Balanced&emsp;High-Protein&emsp;High-Fiber&emsp;Low-Fat&emsp;Low-Carb&emsp;Low-Sodium'
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor='healthLabelsInput'>Health labels</label>
          <input
            type='text'
            id='healthLabelsInput'
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
        {
          hasSettings
            ? filterTab
            : <Loader active />
        }
      </Modal.Content>
      <Modal.Actions>
        <Button
          id='closeSettingsButton'
          onClick={() => {
            saveSetting();
            onClose();
          }}
          content='Save and close'
        />
      </Modal.Actions>
    </Modal>
  );
};