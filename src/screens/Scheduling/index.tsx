import React, { useState } from "react";
import { StatusBar, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";
import { format } from "date-fns";
import { useTheme } from "styled-components";

import { getPlatformDate } from "../../utils/getPlatformDate";
import { CarDTO } from "../../dtos/CarDTO";
import { BackButton } from "../../components/BackButton";
import ArrowSvg from "../../assets/arrow.svg";
import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from "./styles";
import { Button } from "../../components/Button";
import {
  Calendar,
  DayProps,
  generateInterval,
  MarkedDateProps,
} from "../../components/Calendar";

interface RentalPeriod {
  formattedStart: string;
  formattedEnd: string;
}

interface Params {
  car: CarDTO;
}

export function Scheduling() {
  const route = useRoute();
  const { car } = route.params as Params;

  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>(
    {} as DayProps
  );
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>(
    {} as MarkedDateProps
  );
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>(
    {} as RentalPeriod
  );

  const theme = useTheme();
  const navigation = useNavigation();

  function handleConfirmRental() {
    navigation.navigate({
      name: "SchedulingDetails" as never,
      params: {
        car,
        dates: Object.keys(markedDates),
      } as never,
    });
  }

  function handleBack() {
    navigation.goBack();
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if (start.timestamp > end.timestamp) {
      const tmp = start;
      start = end;
      end = tmp;
    }

    setLastSelectedDate(end);

    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const dateStrings: Array<string> = Object.keys(interval);
    const firstDate = dateStrings[0];
    const lastDate = dateStrings[dateStrings.length - 1];
    setRentalPeriod({
      formattedStart: format(
        getPlatformDate(new Date(firstDate)),
        "dd/MM/yyyy"
      ),
      formattedEnd: format(getPlatformDate(new Date(lastDate)), "dd/MM/yyyy"),
    });
  }

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <View style={{ marginTop: 25 }}>
          <BackButton color={theme.colors.shape} onPress={handleBack} />
        </View>
        <Title>
          Escolha uma{"\n"}
          data de início e{"\n"}
          fim do aluguel
        </Title>
        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.formattedStart}>
              {rentalPeriod.formattedStart}
            </DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue selected={!!rentalPeriod.formattedEnd}>
              {rentalPeriod.formattedEnd}
            </DateValue>
          </DateInfo>
        </RentalPeriod>
      </Header>
      <Content>
        <Calendar markedDates={markedDates} onDayPress={handleChangeDate} />
      </Content>
      <Footer>
        <Button
          title="Confirmar"
          onPress={handleConfirmRental}
          enabled={!!rentalPeriod.formattedStart}
        />
      </Footer>
    </Container>
  );
}
