import m from 'mithril';
import randomColor from 'randomcolor';
// @ts-ignore
import allFontAwesomeIcons from '@fortawesome/fontawesome-free/metadata/icons.yml';
import Picker from 'vanilla-picker';
import randomName from './randomName';

const root = document.getElementById('app');

const LOCKED_TITLE = 'Click to unlock and randomize again';
const UNLOCKED_TITLE = 'Click to lock this value so it no longer randomizes';

class App implements m.ClassComponent {
    name: string = ''
    nameLock: boolean = false
    iconName: string = ''
    iconNameLock: boolean = false
    iconBackgroundColor: string = ''
    iconBackgroundColorLock: boolean = false
    iconColor: string = ''
    iconColorLock: boolean = false
    includeBrandIcons: boolean = false

    randomize() {
        if (!this.nameLock) {
            this.name = randomName();
        }

        if (!this.iconNameLock) {
            let iconKeys = Object.keys(allFontAwesomeIcons);

            if (!this.includeBrandIcons) {
                iconKeys = iconKeys.filter(key => {
                    const {styles} = allFontAwesomeIcons[key];

                    // Brand icons will have a single style which is brand, we filter those out
                    return styles.length !== 1 || styles[0] !== 'brands';
                })
            }

            const icon = iconKeys[Math.floor(Math.random() * iconKeys.length)];
            const {styles} = allFontAwesomeIcons[icon];
            const style = styles[Math.floor(Math.random() * styles.length)];

            // Take first letter from the style
            this.iconName = 'fa' + style[0] + ' fa-' + icon;
        }

        let color1 = randomColor({
            luminosity: 'light',
        });
        let color2 = randomColor({
            luminosity: 'dark',
        });

        // Switch colors randomly
        if (Math.random() < 0.5) {
            [color1, color2] = [color2, color1];
        }

        if (!this.iconBackgroundColorLock) {
            this.iconBackgroundColor = color1;
        }

        if (!this.iconColorLock) {
            this.iconColor = color2;
        }
    }

    oninit() {
        this.randomize();
    }

    oncreate(vnode: m.VnodeDOM<any, this>) {
        let isInitialized = false;

        new Picker({
            parent: vnode.dom.querySelector('.js-background-picker'),
            popup: 'top',
            // We need to set a default color so the Picker doesn't call onChange on the first opening
            color: '#000',
            onOpen() {
                // Access this.iconBackgroundColor through the state object so there's no issue with multiple "this"
                this.setColor(vnode.state.iconBackgroundColor, true);
            },
            onChange: (color) => {
                // The Picker calls onChange when it's created because we set a default color. We want to ignore that
                if (!isInitialized) {
                    return;
                }

                this.iconBackgroundColor = color.hex;
                this.iconBackgroundColorLock = true;
                m.redraw();
            },
        });

        new Picker({
            parent: vnode.dom.querySelector('.js-color-picker'),
            popup: 'top',
            color: '#000',
            onOpen() {
                this.setColor(vnode.state.iconColor, true);
            },
            onChange: (color) => {
                if (!isInitialized) {
                    return;
                }

                this.iconColor = color.hex;
                this.iconColorLock = true;
                m.redraw();
            },
        });

        isInitialized = true;
    }

    icon(className: string) {
        return m('.ExtensionIcon', {
            className,
            style: {
                backgroundColor: this.iconBackgroundColor,
                color: this.iconColor,
            },
        }, this.iconName ? m('i.icon', {
            className: this.iconName,
        }) : null);
    }

    view() {
        return [
            m('.Columns', [
                m('.Column', [
                    m('h3', 'Side nav preview'),
                    m('.App-nav.sideNav', m('.ButtonGroup.Dropdown.dropdown.AdminNav.AdminNav-Main.Dropdown--select', m('ul.Dropdown-menu.dropdown-menu ', [
                        m('li.item-category-feature', m('h4.ExtensionListTitle', 'Features')),
                        m('li.item-extension-a', m('a.ExtensionNavButton', {
                            href: '#',
                        }, [
                            m('span.ExtensionListItem-icon.ExtensionIcon'),
                            m('span.Button-label', 'Other extension'),
                            m('span.ExtensionListItem-Dot.enabled'),
                        ])),
                        m('li.item-extension-a', m('a.ExtensionNavButton', {
                            href: '#',
                        }, [
                            this.icon('ExtensionListItem-icon'),
                            m('span.Button-label', this.name),
                            m('span.ExtensionListItem-Dot.enabled'),
                        ])),
                        m('li.item-extension-a', m('a.ExtensionNavButton', {
                            href: '#',
                        }, [
                            m('span.ExtensionListItem-icon.ExtensionIcon'),
                            m('span.Button-label', 'Other extension'),
                            m('span.ExtensionListItem-Dot.disabled'),
                        ])),
                    ]))),
                ]),

                m('.Column', [
                    m('h3', 'Widget preview'),
                    m('.DashboardWidget.Widget.ExtensionsWidget', m('.ExtensionsWidget-list', m('.ExtensionList-Category', [
                        m('h4.ExtensionList-Label', 'Features'),
                        m('ul.ExtensionList', [
                            m('li.ExtensionListItem', m('a', {
                                href: '#',
                            }, m('.ExtensionListItem-content', [
                                m('span.ExtensionListItem-icon.ExtensionIcon'),
                                m('.ExtensionListItem-title', 'Other extension'),
                            ]))),
                            m('li.ExtensionListItem', m('a', {
                                href: '#',
                            }, m('.ExtensionListItem-content', [
                                this.icon('ExtensionListItem-icon'),
                                m('.ExtensionListItem-title', this.name),
                            ]))),
                            m('li.ExtensionListItem.disabled', m('a', {
                                href: '#',
                            }, m('.ExtensionListItem-content', [
                                m('span.ExtensionListItem-icon.ExtensionIcon'),
                                m('.ExtensionListItem-title', 'Other extension'),
                            ]))),
                        ]),
                    ]))),
                ]),

                m('.Column', [
                    m('button.Button.Button--block.Randomize', {
                        type: 'button',
                        onclick: () => {
                            this.randomize();
                        },
                    }, [
                        m('i.Button-icon.icon.fas.fa-magic'),
                        m('span.Button-label', 'Randomize!'),
                    ]),
                    m('.Input', [
                        m('input.FormControl', {
                            type: 'text',
                            value: this.name,
                            oninput: (event: Event) => {
                                this.name = (event.target as HTMLInputElement).value;
                                this.nameLock = true;
                            },
                        }),
                        m('.Input-Controls', [
                            m('button.Input-Lock', {
                                type: 'button',
                                title: this.nameLock ? LOCKED_TITLE : UNLOCKED_TITLE,
                                onclick: () => {
                                    this.nameLock = !this.nameLock;
                                },
                            }, m('i.fas.fa-' + (this.nameLock ? '' : 'un') + 'lock')),
                        ]),
                    ]),
                    m('.Input', [
                        m('input.FormControl', {
                            type: 'text',
                            value: this.iconName,
                            oninput: (event: Event) => {
                                this.iconName = (event.target as HTMLInputElement).value;
                                this.iconNameLock = true;
                            },
                        }),
                        m('.Input-Controls', [
                            m('a', {
                                href: 'https://fontawesome.com/v5.15/icons?m=free',
                                target: '_blank',
                                rel: 'nofollow noopener',
                                title: 'Click to see the full list of FontAwesome icons',
                            }, m('i.icon', {
                                className: this.iconName,
                            })),
                            m('button.Input-Lock', {
                                type: 'button',
                                title: this.iconNameLock ? LOCKED_TITLE : UNLOCKED_TITLE,
                                onclick: () => {
                                    this.iconNameLock = !this.iconNameLock;
                                },
                            }, m('i.fas.fa-' + (this.iconNameLock ? '' : 'un') + 'lock')),
                        ]),
                    ]),
                    m('.Input', [
                        m('input.FormControl', {
                            type: 'text',
                            value: this.iconBackgroundColor,
                            oninput: (event: Event) => {
                                this.iconBackgroundColor = (event.target as HTMLInputElement).value;
                                this.iconBackgroundColorLock = true;
                            },
                        }),
                        m('.Input-Controls', [
                            m('button.Input-Color.js-background-picker', {
                                type: 'button',
                                title: 'Click to pick a color',
                            }, m('i.fas.fa-circle', {
                                style: {
                                    color: this.iconBackgroundColor,
                                },
                            })),
                            m('button.Input-Lock', {
                                type: 'button',
                                title: this.iconBackgroundColorLock ? LOCKED_TITLE : UNLOCKED_TITLE,
                                onclick: () => {
                                    this.iconBackgroundColorLock = !this.iconBackgroundColorLock;
                                },
                            }, m('i.fas.fa-' + (this.iconBackgroundColorLock ? '' : 'un') + 'lock')),
                        ]),
                    ]),
                    m('.Input', [
                        m('input.FormControl', {
                            type: 'text',
                            value: this.iconColor,
                            oninput: (event: Event) => {
                                this.iconColor = (event.target as HTMLInputElement).value;
                                this.iconColorLock = true;
                            },
                        }),
                        m('.Input-Controls', [
                            m('button.Input-Color.js-color-picker', {
                                type: 'button',
                                title: 'Click to pick a color',
                            }, m('i.fas.fa-circle', {
                                style: {
                                    color: this.iconColor,
                                },
                            })),
                            m('button.Input-Lock', {
                                type: 'button',
                                title: this.iconColorLock ? LOCKED_TITLE : UNLOCKED_TITLE,
                                onclick: () => {
                                    this.iconColorLock = !this.iconColorLock;
                                },
                            }, m('i.fas.fa-' + (this.iconColorLock ? '' : 'un') + 'lock')),
                        ]),
                    ]),
                ]),
            ]),
            m('h3', 'composer.json code'),
            m('textarea.FormControl.Export', {
                readonly: true,
                value: JSON.stringify({
                    extra: {
                        'flarum-extension': {
                            title: this.name,
                            category: 'feature',
                            icon: {
                                name: this.iconName || undefined,
                                backgroundColor: this.iconBackgroundColor || undefined,
                                color: this.iconColor || undefined,
                            },
                        },
                    },
                }, null, 4),
            }),
        ];
    }
}

m.mount(root, App);
