<template>
<div id="container">
  <form>
    <div class="field">
      <label for="Begin">Claimed: </label>
      <input @input="set" name="Begin" type="text" autocomplete="off" v-model="claimed" />
    </div>
    <div class="field">
      <label for="End">Submitted: </label>
      <input @input="set" name="End" type="text" autocomplete="off" v-model="submitted" />
    </div>
    <div class="field">
      <label for="End">Break [hh:mm]: </label>
      <input @input="set" name="Break" type="text" autocomplete="off" v-model="breakTime" />
    </div>
    <div class="field">
      <label for="FileLength">File length [hh:mm:ss]: </label>
      <input @input="set" name="FileLength" type="text" autocomplete="off" v-model="fileLength" />
    </div>
    <div class="field">
      <label for="Rate">Pay/min: </label>
      <input @input="set" name="Rate" type="text" autocomplete="off" v-model="rate" />
    </div>
  </form>
  <transition
        appear
        name="slide"
        :key="animationTrigger"
  >

    <section id="results">
      <div class="field">
        <p class="label">Time spent: </p>
        <p class="result">{{totalTimeSpent}}</p>
      </div>
      <div class="field">
        <p class="label">Total pay: </p>
        <p class="result">{{totalPay}}</p>
      </div>
      <div class="field">
        <p class="label">Hourly wage: </p>
        <p class="result" v-bind:style="hwStyle">{{hourlyWage}}</p>
      </div>
      <div class="field">
        <p class="label">Minutes spent per audio minute: </p>
        <p class="result" v-bind:style="mspamStyle">{{minutesSpentPerAudioMinute}}</p>
      </div>
    </section>

  </transition>
</div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'TranscriptCalculator',
  data () {
    return {
      claimed: '9:00',
      submitted: '11:00',
      breakTime: '00:00',
      rate: '0.50',
      fileLength: '00:30:00',
      payPerAudioMinute: null,
      totalPay: null,
      hourlyWage: null,
      minutesSpentPerAudioMinute: null,
      totalTimeSpent: null,
      animationTrigger: false,
      mspamStyle: {},
      hwStyle: {}
    }
  },
  created: function () {
    this.calculate()
  },
  methods: {
    set: function (e) {
      switch (e.target.name) {
        case 'Begin': this.claimed = e.target.value; break
        case 'End': this.submitted = e.target.value; break
        case 'Break': this.breakTime = e.target.value; break
        case 'FileLength': this.fileLength = e.target.value; break
        case 'Rate': this.rate = e.target.value; break
        default: break
      }
      if (this.claimed && this.submitted && this.fileLength) {
        this.calculate(e)
      }
    },
    calculate: function (e) {
      let totalMinutesSpent = null
      let totalFlmMinutes = null // total file length moment minutes
      let totalPay = null
      let blue = '#57CFE5'
      let green = '#57E582'
      let orange = '#E57D57'
      let red = '#E55757'

      this.animationTrigger = !this.animationTrigger

      if (this.claimed && this.submitted) {
        let m1 = moment('1970-01-01 ' + moment().format(this.submitted, 'HH:mm'), 'YYYY-MM-DD HH:mm')
        let m2 = moment('1970-01-01 ' + moment().format(this.claimed, 'HH:mm'), 'YYYY-MM-DD HH:mm')
        let b = moment('1970-01-01 ' + moment().format(this.breakTime, 'HH:mm'), 'YYYY-MM-DD HH:mm')

        m1.subtract({hour: m2.get('hour'), minute: m2.get('minute')})
        m1.subtract({hour: b.get('hour'), minute: b.get('minute')})
        // let elapsedMoment = moment('1970-01-01').add(m1, 'ms')
        this.totalTimeSpent = m1.format('H:mm')

        totalMinutesSpent = m1.get('hour') * 60 + m1.get('minute')
      }
      if (this.fileLength && this.rate) {
        // file length moment
        let flm = moment('1970-01-01 ' + this.fileLength, 'YYYY-MM-DD HH:mm:ss')
        totalFlmMinutes = flm.get('hour') * 60 + flm.get('minute') + (flm.get('second') / 60)

        totalPay = (totalFlmMinutes * this.rate).toFixed(2)
      }
      if (this.claimed && this.submitted && this.fileLength) {
        // minutes spent per audio minute
        this.minutesSpentPerAudioMinute = (totalMinutesSpent / totalFlmMinutes).toFixed(2)

        if (this.minutesSpentPerAudioMinute <= 2) {
          this.mspamStyle.color = blue
        } else if (this.minutesSpentPerAudioMinute <= 4) {
          this.mspamStyle.color = green
        } else if (this.minutesSpentPerAudioMinute <= 5) {
          this.mspamStyle.color = orange
        } else if (this.minutesSpentPerAudioMinute > 5) {
          this.mspamStyle.color = red
        }

        // hourly wage
        this.totalPay = '$' + totalPay
        let hourlyWage = (totalPay / (totalMinutesSpent / 60)).toFixed(2)
        this.hourlyWage = '$' + hourlyWage

        if (hourlyWage >= 10) {
          this.hwStyle.color = blue
        } else if (hourlyWage >= 7.15) {
          this.hwStyle.color = green
        } else if (hourlyWage >= 6) {
          this.hwStyle.color = orange
        } else {
          this.hwStyle.color = red
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$form-bg: rgba(255, 255, 255, 0.719);
$label: #EB8E8E;
$base-text: #eee;
$input-color: #ddd;
$input-bg: #555;
$results-bg: rgba(0, 0, 0, 0.692);

::selection {
  background: rgb(231, 224, 224);
}
#container {
  font-size: 1rem;
  display: flex;
  margin: auto;
  border-radius: 20px 20px 0px 0px;
  margin: auto;
  width: 98%;
  flex-direction: column;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
}
form {
  display: flex;
  border-radius: 20px 20px 0px 0px;
  background-color: $form-bg;
  flex-direction: column;
  padding: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.3);
}
label, .label {
  color: $label;
  font-weight: bold;
  font-family: 'Sedgwick Ave', cursive;
  text-align: left;
  margin: auto;
  width: 100%;
  display: block;
}
.label {
  color: $base-text;
  font-family: inherit;
}
input, .result {
  font-size: inherit;
  color: $input-color;
  background-color: $input-bg;
  outline: none;
  border: none;
  padding: 5px;
  display: block;
}
.result {
  background-color: transparent;
  padding: 0px;
  margin: 0px;
}
.field {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  margin-bottom: 20px;
}
.field:last-child {
  margin-bottom: 0px;
}
#results {
  padding: 20px;
  display: flex;
  flex-direction: column;
  color: $base-text;
  position: relative;
  z-index: -1;
  font-family: 'Cutive Mono', monospace;
  background-color: $results-bg;
  text-align: left;
  padding-bottom: 20px 0px;
}
.slide-move {
  transition: all .3s ease;
}
.slide-enter-active {
  transition: all .3s ease;
}
.slide-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-enter, .slide-leave-to {
  margin-top: -30%;
  opacity: 0;
}

@media screen and (min-width: 540px) {
  .field {
    flex-direction: row;
  }
}
@media screen and (min-width: 768px) {
  #container {
    font-size: 1.3rem;
    width: 80%;
  }
}
@media screen and (min-width: 1100px) {
  #container {
    font-size: 1.4rem;
    width: 50%;
  }
}
@media screen and (min-width: 1600px) {
  #container {
    font-size: 1.6rem;
    width: 40%;
  }
}
</style>
