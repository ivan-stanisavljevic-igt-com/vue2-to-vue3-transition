<template>
  <div class="acreg">
<!--    isLoggedIn-isLoggedIn-2 {{ isLoggedIn }}-->
    <div v-if="!isLoggedIn" class="login-info">
      <h1 style="text-align:center">New Player Registration</h1>
      <div class="ctsform">
        <div class="stepindicators">
          <span :class="{ 'active': regstep === 'one' }">1</span>
          <span :class="{ 'active': regstep === 'two' }">2</span>
          <span :class="{ 'active': regstep === 'three' }">3</span>
          <span :class="{ 'active': regstep === 'four' }">4</span>
        </div>
        <div v-if="regstep === 'one'">
          <div class="legend">Login details</div>
          <div class="control-block lined">
            <input type="text" id="email" />
            <label class="control-label">Email*</label>
            <div class="line"></div>
          </div>
          <div class="control-block clearafter">
            <input type="text" id="emailc" />
            <label class="control-label">Confirm email*</label>
          </div>
          <div class="control-block clearafter">
            <input type="password" id="password" class="" maxlength="20" tabindex="3" />
            <label class="control-label">Password*</label>
            <!--<div>Passwords must be at least 8 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character</div>-->
          </div>
          <div class="control-block clearafter">
            <input type="password" id="passwordc" class="" maxlength="20" tabindex="3" />
            <label class="control-label">Confirm Password*</label>
          </div>
          <div class="control-block finfo finfo-c">* This is a Required Field</div>
          <div class="form-actions">
            <button class="btn primary-btn" @click="gotoStep('two')">Next</button>
          </div>
        </div>

        <div v-if="regstep === 'two'">
          <div class="legend">Personal Information</div>
          <div class="halfs">
            <div class="half">
              <div class="control-block">
                <input type="text" id="firstname" />
                <label class="control-label">First Name*</label>
              </div>
            </div>
            <div class="half">
              <div class="control-block">
                <input type="text" id="middlename" />
                <label class="control-label">Middle Name/Initial</label>
              </div>
            </div>
          </div>
          <div class="control-block">
            <input type="text" id="lastname" />
            <label class="control-label">Last Name*</label>
          </div>
          <div class="halfs">
            <div class="half">
              <div class="control-block withfocus">
                <select>
                  <option>Select a gender</option>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="UNSPECIFIED">Prefer Not to Share</option>
                </select>
                <label class="control-label">Gender*</label>
              </div>
            </div>
            <div class="half">
              <div class="control-block control-block-dob withfocus">
                <input type="number" id="dobm" placeholder="MM" min="1" max="12" /><input type="number" id="dobd" placeholder="DD" min="1" max="31" /><input type="number" id="doby" placeholder="YYYY" min="1900" max="2030" />
                <label class="control-label">Date of birth*</label>
              </div>
            </div>
          </div>
          <div class="control-block">
            <input type="number" id="phonenumber" maxlength="20">
            <label class="control-label">Phone number*</label>
          </div>
          <div class="control-block">
            <input type="number" id="mobilenumber" maxlength="20">
            <label class="control-label">Mobile number</label>
          </div>
          <div class="control-block">
            <input type="text" id="address" autocomplete="off">
            <label class="control-label">House number and Street*</label>
          </div>
          <div class="control-block">
            <input type="text" id="address2" autocomplete="off">
            <label class="control-label">Address line 2</label>
          </div>
          <div class="halfs clearafter">
            <div class="half">
              <div class="control-block">
                <input type="text" id="lastname" />
                <label class="control-label">ZIP Code*</label>
              </div>
            </div>
          </div>
          <div class="halfs clearafter">
            <div class="half">
              <div class="control-block">
                <input type="text" id="addresscity" />
                <label class="control-label">City/Town*</label>
              </div>
            </div>
            <div class="half">
              <div class="control-block withfocus">
                <select id="addressstate">
                  <option value="RI">Rhode Island</option>
                  <option value="AK">Alaska</option>
                  <option value="AL">Alabama</option>
                  <option value="AR">Arkansas</option>
                  <option value="AZ">Arizona</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DC">District of Columbia</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="IA">Iowa</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MD">Maryland</option>
                  <option value="ME">Maine</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MO">Missouri</option>
                  <option value="MS">Mississippi</option>
                  <option value="MT">Montana</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="NE">Nebraska</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NV">Nevada</option>
                  <option value="NY">New York</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VA">Virginia</option>
                  <option value="VT">Vermont</option>
                  <option value="WA">Washington</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WV">West Virginia</option>
                  <option value="WY">Wyoming</option>
                </select>
                <label class="control-label">State</label>
              </div>
            </div>
          </div>
          <div class="control-block">
            <input type="number" id="ssn" min="0000" max="9999">
            <label class="control-label">SSN (Last 4 Digit)*</label>
          </div>
          <div class="control-block finfo finfo-c">* This is a Required Field</div>
          <div class="form-actions">
            <button class="btn secondary-btn" @click="gotoStep('one')">Back</button>
            <button class="btn primary-btn" @click="gotoStep('three')">Next</button>
          </div>
        </div>

        <div v-else-if="regstep == 'three'">
          <div class="legend">Account Security Question</div>
          <div class="control-block withfocus">
            <select id="squestion">
              <option value="">Please select question</option>
              <option value="securityQuestion.city">In what city were you born?</option>
              <option value="securityQuestion.teacher">What was the name of your first school teacher?</option>
              <option value="securityQuestion.song">What is your favorite song?</option>
              <option value="securityQuestion.father">What is your father's middle name?</option>
              <option value="securityQuestion.car">What was the make of your first car?</option>
            </select>
            <label class="control-label">Secret Question</label>
          </div>
          <div class="control-block">
            <input type="text" id="squestionans" autocomplete="off" />
            <label class="control-label">Secret Answer</label>
          </div>

          <div class="control-block finfo finfo-c">* This is a Required Field</div>
          <div class="form-actions">
            <button class="btn secondary-btn" @click="gotoStep('two')">Back</button>
            <button class="btn primary-btn" @click="gotoStep('four')">Next</button>
          </div>
        </div>

        <div v-else-if="regstep == 'four'">
          <div class="legend">Almost there!</div>
          <div class="control-block">
            <div style="font-weight:bold">Message Preferences</div>
            <div style="font-style:italic; color:#999;">You can further update the notifications you receive from your user profile after registration.</div>
          </div>
          <div class="text-block">Would you like to receive emails about:</div>
          <div class="halfs">
            <div class="half"><div class="control-block"><label><input type="checkbox" id="acceptmarketing1" /> Winning Bets & Jackpots (nightly)</label></div></div>
            <div class="half"><div class="control-block"><label><input type="checkbox" id="acceptmarketing2" /> Promotions (occasional)</label></div></div>
          </div>
          <div class="text-block">Would you like to receive text messages about:</div>
          <div class="halfs clearafter">
            <div class="half"><div class="control-block"><label><input type="checkbox" id="acceptmarketing3" /> Winning Bets & Jackpots (nightly)</label></div></div>
            <div class="half"><div class="control-block"><label><input type="checkbox" id="acceptmarketing4" /> Promotions (occasional)</label></div></div>
            <div class="half">
              <div class="control-block">
                <input type="text" id="acceptmarketingmobile" />
                <label class="control-label">Mobile number</label>
              </div>
            </div>
          </div>
          <div class="control-block finfo">By submitting your phone number you are agreeing to subscribe and receive notifications from the RI Lottery. No purchase necessary to receive notifications. Msg & data rates may apply. Message frequency varies. Reply HELP for help. Reply STOP to cancel. See our <a href="#" target="_blank">Privacy Policy</a> for additional information.</div>
          <div class="control-block"><label><input type="checkbox" id="termsagree" /> I have read and accepted the <a href="#" target="_blank">Terms &amp; Conditions</a></label></div>
          <div class="form-actions">
            <button class="btn secondary-btn" @click="gotoStep('three')">Back</button>
            <button class="btn primary-btn" @click="register()">Finish Registration</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoggedIn" class="account-info">
      You are already registered.<br />
      Go to Sports page to place bets.
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'

  import LoginComponent from '@/components/core/LoginComponent'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import Screen from '@/components/mixins/Screen'

  import Icon from '@/components/common/Icon'

  export default {
    name: 'AccountRegisterComponent',

    mixins: [
      Screen
    ],

    data () {
      return {
        regstep: 'one' // one, two, three, four
      }
    },

    components: {
      SiteNavigation,
      LoginComponent,
      Icon
    },

    computed: {
      externalUrls () {
        return config.externalUrls
      },
      regstep () {
        return this.regstep
      },
      showBalance () {
        return store.getters['getShowBalance']
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      dialogLogin: {
        get: () => {
          return store.getters['overlayState/getLoginDialogState']
        },
        set: (newValue) => {
          if (newValue) {
            store.dispatch('overlayState/activateLoginDialog')
          } else {
            store.dispatch('overlayState/deactivateLoginDialog')
          }
        }
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      }
    },

    methods: {
      logout () {
        store.dispatch('logout')
      },
      gotoStep (step) {
        if (['one', 'two', 'three', 'four'].indexOf(step) > -1) { this.regstep = step }
      },

      register () {
        let pEmail = null
        let pPassword = null
        let pFirtsName = null
        let pMiddleName = null
        let pLastName = null
        let pGender = null
        let pDob = null
        let pPhoneNumber = null
        let pMobileNumber = null
        let pAddress = null
        let pAddressLine2 = null
        let pZipCode = null
        let pCity = null
        let pState = null
        let pSsn = null
        let pSQAs = []
        let pRreceiveEmailsAboutWinningBets = null
        let pReceiveEmailsAboutPromotions = null
        let pReceiveSmsAboutWinningBets = null
        let pReceiveSmsAboutPromotions = null
        let pAffiliateCode = null

        /* Extract input data and pass to call */

        store.dispatch('accountState/register', {
          email: pEmail,
          password: pPassword,
          firtsName: pFirtsName,
          middleName: pMiddleName,
          lastName: pLastName,
          gender: pGender,
          dob: pDob,
          phoneNumber: pPhoneNumber,
          mobileNumber: pMobileNumber,
          address: pAddress,
          addressLine2: pAddressLine2,
          zipCode: pZipCode,
          city: pCity,
          state: pState,
          ssn: pSsn,
          securityQuestionAndAnswers: pSQAs,
          receiveEmailsAboutWinningBets: pRreceiveEmailsAboutWinningBets,
          receiveEmailsAboutPromotions: pReceiveEmailsAboutPromotions,
          receiveSmsAboutWinningBets: pReceiveSmsAboutWinningBets,
          receiveSmsAboutPromotions: pReceiveSmsAboutPromotions,
          affiliateCode: pAffiliateCode
        }).then(() => {
          console.log('Register finished')
        }).catch(() => {
          console.log('Register exception')
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .acreg { background-color:#fff; border:solid 1px #ddd; padding:50px; width:800px; max-width:90%; margin:0 auto; }
  .acreg .ctsform { width:500px; max-width :90%; margin:0 auto; }

  .stepindicators { text-align: center; padding-bottom:25px; }
  .stepindicators span { display:inline-block; width:28px; font-size:12px; line-height:26px; border:solid 1px dodgerblue; border-radius:14px; box-sizing:border-box; }
  .stepindicators span.active { color:#fff; background-color:dodgerblue; border-color:dodgerblue; }
  .stepindicators span + span { margin-left:5px; }

  .ctsform { text-align:left; font-size: 16px; line-height: 20px; font-weight: normal; }

  .ctsform .legend{ margin-bottom:15px; padding:0; display:block; font-weight:bold; text-align:center; }
  .ctsform .control-block{ clear:both; margin-bottom:15px; display:block; position:relative; }
  .ctsform .control-block.nomarg{ margin-bottom:0; }
  .ctsform .form-actions{ clear:both; margin-bottom:0; display:block; text-align:center; }
  .ctsform .form-actions input[type=text]{ display:inline-block; width:auto; }
  .ctsform .form-actions buttom + buttom { margin-left: 30px; }


  .ctsform input[type=text], .ctsform input[type=number], .ctsform input[type=password], .ctsform input[type=email], .ctsform input[type=url], .ctsform select{
	  box-sizing:border-box;
	  padding:30px 10px 5px;
	  width:100%;
	  clear:both;
	  display:block;
    position:relative;
    z-index:2;
  }
  .ctsform input:focus,
  .ctsform select:focus { outline:none; }

  .ctsform .control-label { position:absolute; z-index:1; top:0; right:0; left:0; height:55px; padding:30px 10px 0; font-size:16px; line-height:20px;  transition: all 0.2s ease-in; }
  .ctsform .control-label:after { content:""; position:absolute; right:0; bottom:0; left:0; height:2px; background-color:#ddd; }
  .ctsform .withfocus .control-label { padding-top:0; font-size:12px; color:#999; }
  .ctsform input:focus + .control-label,
  .ctsform select:focus + .control-label { padding-top:0; font-size:12px; color:#ff671f; background-color:#f6f6f6; }
  .ctsform input:focus + .control-label:after,
  .ctsform select:focus + .control-label:after { background-color:#ff671f }

  .ctsform button{
	  background: #428bca repeat scroll 0 0;
	  border: 0 none;
	  cursor: pointer;
	  display: inline-block;
	  margin-bottom: 0;
	  padding: 0 25px;
	  font-weight:bold;
	  line-height:300%;
	  color: #fff;
	  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
  }

  .ctsform button:hover, a.button:hover, .buttons button:hover{
	  color:#fff;
	  background:#0096C9;
  }

  .ctsform .control-block-dob input { display:inline-block; width:28%; }
  .ctsform .control-block-dob input:nth-child(-n+3):after { content:" / "; color:#999; }

  .ctsform .finfo { font-size:smaller; color:#666; }
  .ctsform .finfo-c { text-align:center; }


  @media (min-width: 601px) {
    .half { width:49%; float:left; }
	.half:nth-child(2n+1) { clear:left; padding-right:1%; }
	.half:nth-child(2n+2) { width:50%; }

	.third { width:33%; float:left; }
	.third:nth-child(3n+1) { padding-right:1%; clear:left; }
	.third:nth-child(3n+2) { padding-right:1%; }
	.third:nth-child(3n+3) {  width:33%; }
}

.clearafter:after { visibility: hidden; display: block; font-size: 0; content: " "; clear: both; height: 0; }

</style>
