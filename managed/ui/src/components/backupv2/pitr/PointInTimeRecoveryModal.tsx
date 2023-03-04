/*
 * Created on Wed Jun 08 2022
 *
 * Copyright 2021 YugaByte, Inc. and Contributors
 * Licensed under the Polyform Free Trial License 1.0.0 (the "License")
 * You may not use this file except in compliance with the License. You may obtain a copy of the License at
 * http://github.com/YugaByte/yugabyte-db/blob/master/licenses/POLYFORM-FREE-TRIAL-LICENSE-1.0.0.txt
 */

import React, { FC } from 'react';
import moment from 'moment';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from 'react-query';
import { Field, FormikProps } from 'formik';
import { Col, Row } from 'react-bootstrap';

import { YBModalForm } from '../../common/forms';
import { YBFormSelect, YBNumericInput } from '../../common/forms/fields';
import { restoreSnapShot } from '../common/PitrAPI';
import CautionIcon from '../common/CautionIcon';
import './PointInTimeRecoveryModal.scss';
import { ybFormatDate } from '../../../redesign/helpers/DateUtils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const reactWidgets = require('react-widgets');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const momentLocalizer = require('react-widgets-moment');
require('react-widgets/dist/css/react-widgets.css');

const { DatePicker, TimePicker } = reactWidgets;
momentLocalizer(moment);

interface PointInTimeRecoveryModalProps {
  visible: boolean;
  onHide: () => void;
  universeUUID: string;
  config: any;
}

enum RECOVERY_MODE {
  'RELATIVE',
  'EXACT'
}

const DATE_FORMAT = 'YYYY/MM/DD';

const DURATION_OPTIONS = [
  {
    label: 'Day',
    value: 'DAY',
    seconds: 24 * 60 * 60 * 1000 //milli-secs in a day
  },
  {
    label: 'Hour',
    value: 'HOUR',
    seconds: 60 * 60 * 1000 //milli-secs in an hour
  },
  {
    label: 'Minute',
    value: 'MINUTE',
    seconds: 60 * 1000 //milli-secs in a minute
  }
];

interface Form_Values {
  recovery_time_mode: RECOVERY_MODE;
  recovery_interval: number;
  recovery_duration: Record<string, string | number>;
  customDate?: string;
  customTime?: string;
}

const initialValues: Form_Values = {
  recovery_time_mode: RECOVERY_MODE.RELATIVE,
  recovery_duration: DURATION_OPTIONS[0],
  recovery_interval: 1
};

const TOAST_AUTO_CLOSE_INTERVAL = 3000;

export const PointInTimeRecoveryModal: FC<PointInTimeRecoveryModalProps> = ({
  visible,
  onHide,
  config,
  universeUUID
}) => {
  const queryClient = useQueryClient();
  const currentUserTimezone = useSelector((state: any) => state.customer.currentUser.data.timezone);

  const createPITR = useMutation((values: any) => restoreSnapShot(universeUUID, values), {
    onSuccess: () => {
      toast.success(`${config.dbName} recovered successfully!`, {
        autoClose: TOAST_AUTO_CLOSE_INTERVAL
      });
      queryClient.invalidateQueries(['scheduled_sanpshots']);
      onHide();
    },
    onError: () => {
      toast.error(`Failed to recover ${config.dbName}.`, { autoClose: TOAST_AUTO_CLOSE_INTERVAL });
      onHide();
    }
  });

  if (!config) return <React.Fragment></React.Fragment>;

  const minTime = config.minRecoverTimeInMillis;
  const maxTime = config.maxRecoverTimeInMillis;

  const getFinalTimeStamp = (values: any) => {
    const {
      recovery_time_mode,
      recovery_duration,
      recovery_interval,
      customDate,
      customTime
    } = values;
    let finalTimeStamp = moment.now();
    if (recovery_time_mode === RECOVERY_MODE.RELATIVE) {
      const secsInSelectedDuration = DURATION_OPTIONS.find(
        (duration: any) => duration.value === recovery_duration.value
      )?.seconds;
      const currentTimeStamp = moment.now();

      if (secsInSelectedDuration) {
        finalTimeStamp = currentTimeStamp - secsInSelectedDuration * Number(recovery_interval);
      }
    }

    const convertToTZ = (date: any, timeZone: any) =>
      new Date(date.toLocaleString('en-US', { timeZone }));

    if (recovery_time_mode === RECOVERY_MODE.EXACT) {
      const dateTime = new Date(
        customDate.getFullYear(),
        customDate.getMonth(),
        customDate.getDate(),
        customTime.getHours(),
        customTime.getMinutes(),
        customTime.getSeconds()
      );
      const convertedDate = convertToTZ(
        dateTime,
        currentUserTimezone ? currentUserTimezone : 'UTC'
      );
      const timezoneDiff = moment(dateTime).unix() - moment(convertedDate).unix();
      finalTimeStamp = (moment(dateTime).unix() + timezoneDiff) * 1000;
    }

    return finalTimeStamp;
  };

  const validateForm = (values: any): any => {
    const {
      recovery_time_mode,
      recovery_duration,
      recovery_interval,
      customDate,
      customTime
    } = values;
    const errors = {
      recovery_time_mode: 'Please select a time within your retention period'
    };

    if (recovery_time_mode === RECOVERY_MODE.RELATIVE && !(recovery_duration && recovery_interval))
      return errors;

    if (recovery_time_mode === RECOVERY_MODE.EXACT && !(customDate && customTime)) return errors;

    const finalTimeStamp = getFinalTimeStamp(values);
    const delay = 60000; // delay of 1 min in case if min and max time are the same
    if (!(finalTimeStamp >= minTime - delay && finalTimeStamp <= maxTime + delay)) return errors;

    return {};
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: any; setFieldError: any }
  ) => {
    setSubmitting(false);
    const payload = {
      restoreTimeInMillis: getFinalTimeStamp(values),
      pitrConfigUUID: config.uuid
    };
    createPITR.mutateAsync(payload);
  };

  return (
    <YBModalForm
      title={`Recover ${config.dbName} to a point in time`}
      visible={visible}
      onHide={onHide}
      submitLabel="Recover"
      onFormSubmit={handleSubmit}
      showCancelButton
      dialogClassName="pitr-recovery-modal"
      submitTestId="PitrRecoverySubmitBtn"
      cancelTestId="PitrRecoveryCancelBtn"
      initialValues={initialValues}
      validate={validateForm}
      render={({ values, setFieldValue }: FormikProps<Form_Values>) => {
        const error = validateForm(values)?.recovery_time_mode;

        return (
          <>
            <div className="notice">
              You may recover {config.dbName} to any time between{' '}
              <b>
                {ybFormatDate(minTime)}
              </b>{' '}
              and{' '}
              <b>
                {ybFormatDate(maxTime)}
              </b>
            </div>
            <Row>
              <Col lg={6} className="no-padding">
                <Field
                  name="recovery_time_mode"
                  checked={values['recovery_time_mode'] === RECOVERY_MODE.RELATIVE}
                  type="radio"
                >
                  {() => (
                      <div
                        className={clsx('pitr-custom-radio center-align', {
                          active: values['recovery_time_mode'] === RECOVERY_MODE.RELATIVE
                        })}
                      >
                        <input
                          type="radio"
                          checked={values['recovery_time_mode'] === RECOVERY_MODE.RELATIVE}
                          onClick={() => {
                            setFieldValue('recovery_time_mode', RECOVERY_MODE.RELATIVE, true);
                          }}
                          id="PitrRelativeRecovery"
                        />
                        <div className="relative-time-mode">
                          <Field
                            name="recovery_interval"
                            component={YBNumericInput}
                            input={{
                              onChange: (val: number) =>
                                setFieldValue('recovery_interval', val, true),
                              value: values['recovery_interval'],
                              id:"PitrRecoveryInterval"
                            }}
                            minwidth="80px"
                            minVal={1}
                          />
                          <Field
                            className="recovery_duration"
                            component={YBFormSelect}
                            options={DURATION_OPTIONS}
                            width={140}
                            name="recovery_duration"
                            id="PitrRecoveryDuration"
                          />
                          <span>Ago</span>
                          <div className="break" />
                          {values['recovery_time_mode'] === RECOVERY_MODE.RELATIVE && error ? (
                            // eslint-disable-next-line react/jsx-indent
                            <div className="pitr-error-text">
                              <CautionIcon />
                              &nbsp;{error}
                            </div>
                          ) : (
                            <div className="pitr-info-text">
                              Will recover to:{' '}
                              {
                                ybFormatDate(getFinalTimeStamp({
                                  ...values,
                                  recovery_time_mode: RECOVERY_MODE.RELATIVE
                                }))
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Field>
              </Col>
            </Row>
            <Row>
              <Col lg={6} className="no-padding">
                <Field
                  name="recovery_time_mode"
                  onChange={() =>
                    setFieldValue('recovery_time_mode' as never, RECOVERY_MODE.EXACT, false)
                  }
                  type="radio"
                >
                   {() => (
                      <div
                        className={clsx('pitr-custom-radio center-align', {
                          active: values['recovery_time_mode'] === RECOVERY_MODE.EXACT
                        })}
                      >
                        <input
                          type="radio"
                          checked={values['recovery_time_mode'] === RECOVERY_MODE.EXACT}
                          onClick={() => {
                            setFieldValue('recovery_time_mode', RECOVERY_MODE.EXACT, true);
                            !values.customDate && setFieldValue('customDate', new Date());
                            !values.customTime && setFieldValue('customTime', new Date());
                          }}
                          id="PitrAbsoluteRecovery"
                        />
                        <div className="exact-time-mode">
                          <Row>
                            <Col xs={6} className="no-padding">
                              Date
                              <DatePicker
                                placeholder="Pick a time"
                                format={DATE_FORMAT}
                                value={values.customDate}
                                max={new Date()}
                                defaultValue={new Date()}
                                onChange={(dt: Date) =>
                                  setFieldValue('customDate' as never, dt, true)
                                }
                                id="PitrRecoveryDateSelector"
                              />
                            </Col>

                            <Col xs={6} className="no-padding">
                              Time
                              <TimePicker
                                defaultValue={new Date()}
                                value={values.customTime}
                                onChange={(time: Date) =>
                                  setFieldValue('customTime' as never, time, true)
                                }
                                id="PitrRecoveryTimeSelector"
                              />
                            </Col>
                          </Row>

                          <Row>
                            <div className="break" />
                            {values['recovery_time_mode'] === RECOVERY_MODE.EXACT && error && (
                              <div className="pitr-error-text">
                                <CautionIcon />
                                &nbsp;{error}
                              </div>
                            )}
                          </Row>
                        </div>
                      </div>
                    )}
                  </Field>
              </Col>
            </Row>
            <Row></Row>
          </>
        );
      }}
    />
  );
};
