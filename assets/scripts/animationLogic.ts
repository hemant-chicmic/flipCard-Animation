import { _decorator, Component, Node, tween, Quat, math, Vec3, Sprite, UIRenderer, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('animationLogic')
export class animationLogic extends Component {

    @property({ type: Node })
    logoImg: Node | null = null;

    @property({ type: Node })
    backCard: Node | null = null;

    private isAnimating: boolean = false;
    private childX: number = 0;
    private childY: number = 0;

    start() {
        let cards = this.node.getChildByName('Cards');
        cards.children.forEach(child => {
            child.active = false;
            this.childX = child.position.x;
            this.childY = child.position.y;
        });
        this.logoLogic();
        this.backCard.active = false; 
    }

    update(deltaTime: number) {
        if (this.isAnimating) {
            this.cardsAnimation();
        }
    }

    logoLogic() {


        // let logoOpacity = this.logoImg.getComponent(UIOpacity) ;
        // logoOpacity.opacity = 300 ; 

        const delay = 1;
        tween(this.logoImg)
            .delay(delay)
            .call(() => {
                this.logoImg.setRotationFromEuler(0, 0, 0);
            })
            .delay(0.5)
            .call(() => {
                this.logoImg.active = false;
            })
            .delay(1)
            .call(() => {
                this.isAnimating = true;
            })
            .to(0.5 , { scale: new Vec3(1, 1, 1) }, { easing: 'quadInOut' } )
            .start();
    }
    
    

    cardsAnimation() {
        this.isAnimating = false;
        console.log("Animate cards");

        let cards = this.node.getChildByName('Cards');
        let childrenCount = cards.children.length;
        let activationSpeed = 0.7;
        let totalDuration = 0;
        

        // Activate the cards one by one
        for (let i = 0; i < childrenCount; i++) 
        {
            let card = cards.children[i];
            let distX = 170 * i;
            let height = 60;


            this.scheduleOnce(() => {
                if (i % 2 === 0) {
                    this.backCard.setScale( new Vec3( 0.5 , 0.5, 0.5)  ) ;
                    this.backCard.active = true;
                    const height = this.childY;
                    this.backCard.setPosition(new Vec3(this.childX + distX, height, 0));
                    tween(this.backCard)
                        .to(0.1, { scale: new Vec3(1.1, 1.1, 1) })
                        // .to(0.08, { scale: new Vec3(1, 1, 1) })
                        .to(0.15, { scale: new Vec3(0.3, 1, 1 ) }, {
                            easing: 'quadInOut',
                            onComplete: () => { // Execute onComplete callback when tween completes
                                this.backCard.active = false;
                                card.setScale( new Vec3( 0.2 , 1, 1)  ) ;
                                card.active = true;
                                card.setPosition(new Vec3(this.childX + distX, height, 0));
                                tween(card)
                                    // .to(0.08, { scale: new Vec3(0.3, 1, 1) })
                                    .to(0.15, { scale: new Vec3(1.1, 1.1, 1.1) }, {
                                        easing: 'quadInOut',
                                        onComplete: () => { // Execute onComplete callback when tween completes
                                            // this.isAnimating = true;
                                        }
                                    })
                                    .start();
                            }
                        })
                        .start();
    
                } 
                else {
                    card.setScale( new Vec3( 0.5 , 0.5, 0.5)  );
                    card.active = true;
                    height = this.childY - 60;
                    card.setPosition(new Vec3(this.childX + distX, height, 0)) ;
                    tween(card)
                    // .to(0.1, { scale: new Vec3(0.7, 0.7, 0.7) })
                    .to(0.1, { scale: new Vec3(1.2, 1.2, 1.2) })
                    .to(0.15, { scale: new Vec3(1.1, 1.1, 1.1) }, {
                        easing: 'quadInOut',
                        onComplete: () => { // Execute onComplete callback when tween completes
                        }
                    })
                    .start();
                }

                totalDuration += i * activationSpeed ;

            }, (i) * activationSpeed);

        }
        // totalDuration += childrenCount * activationSpeed ;

        // Deactivate the cards one by one in reverse order
        
        let deactivationSpeed = 0.3;
        this.scheduleOnce( () =>{
            for( let i = childrenCount - 1; i >= 0; i--) 
            {
                let card = cards.children[i];
                this.scheduleOnce( () =>{
                    tween(card)
                    .to(0.1, { scale: new Vec3(1.2, 1.2, 1.2) })
                    .to(0.1, { scale: new Vec3(1, 1.3, 1.2) })
                    // .to(0.1, { scale: new Vec3(1, 1, 1) })
                    .to(0.05, { scale: new Vec3(0.3, 0.3, 0.3) }, {
                        easing: 'quadInOut',
                        onComplete: () => { // Execute onComplete callback when tween completes
                            card.active = false;
                            card.setScale( new Vec3( 1 , 1, 1)  )
                        }
                    })
                    .start();
                } , (childrenCount - i) * deactivationSpeed )
            }

        } , childrenCount * activationSpeed+0.5 ) ; 


        this.scheduleOnce( () =>{
            this.isAnimating = true ;
        } , childrenCount * activationSpeed + childrenCount * deactivationSpeed + 1.5 )
    }
}
