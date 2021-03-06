import { GridLayout, Label, Observable } from '@nativescript/core'
import * as dayjs from 'dayjs'

export class CalendarModel extends Observable {
  private grid: GridLayout;

  private monthName: string; // отображаемый месяц и год
  currDay: dayjs.Dayjs; // объект для хранения даты
  labels = []; // Массив Label-ов

  constructor() {
    super();

    // в цикле заполняем массив Label-ов
    for(let i = 0; i < 31; i++){ 
      let label = new Label();
      label.text = String(i + 1);
      label.className="wd";
      this.labels.push(label)
    }

    this.currDay = dayjs(); // устанавливем текущий день
    this.setMonthName(); // обновляем отображаемый месяц и год
  }
  
  private setMonthName(){
    const names = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    this.set('monthName', names[this.currDay.get('month')] + " " + this.currDay.get('year'));
  }

  private reloadGrid(){
    let startMonth = this.currDay.startOf('month'); // начало этого месяца
    let endMonth = this.currDay.endOf('month'); // конец этого месяца

    this.labels[28].className="hide"; // скрываем 29, 30 и 31 дни
    this.labels[29].className="hide"; 
    this.labels[30].className="hide";
    

    let weeknum = 1;
    let nextweek = false;
    for(let i = 0; i < endMonth.date(); i++){ // цикл по дням месяца
      
      let currenDate = startMonth.add(i, 'day'); // получаем текущий день цикла

      this.labels[i].className="wd"; // применяем обычный стиль ко всем дням

      if (currenDate.day()===0){ // если сейчас воскресенье
        GridLayout.setColumn(this.labels[i], 6);
        nextweek = true;
      }
      else{
        GridLayout.setColumn(this.labels[i], currenDate.day() - 1);
      }

      GridLayout.setRow(this.labels[i], weeknum);

      if (nextweek){
        nextweek = false;
        weeknum++;
      }
    }

    this.labels[this.currDay.date()].className="td"; // подсвечиваем текущий день
  }

  prev(args) {
    this.currDay = this.currDay.subtract(1, 'month'); // вычитаем один месяц
    this.setMonthName(); // обновляем отображаемый месяц
    this.reloadGrid(); // обновляем сетку
  }

  next(args) {
    this.currDay = this.currDay.add(1, 'month'); // прибавляем месяц
    this.setMonthName(); // обновляем отображаемый месяц
    this.reloadGrid(); // обновляем сетку
  }

  today(args) {
    this.currDay = dayjs(); // текущий месяц
    this.setMonthName(); // обновляем отображаемый месяц
    this.reloadGrid(); // обновляем сетку
  }

  loadedGrid(args) {
    this.grid = args.object as GridLayout;
    const wd = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    for(let i = 0; i <= wd.length; i++){
      let label = new Label();
      label.text = wd[i];
      label.className="wd";
      this.grid.addChild(label);
      GridLayout.setRow(label,0)
      GridLayout.setColumn(label,i)
    }

    for(let i = 0; i < 31; i++){
      this.grid.addChild(this.labels[i]);
    }

    this.reloadGrid();
  }
}
