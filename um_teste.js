let t = 
{
    "val": "/",
    "depth": 0,
    "left": {
        "val": "+",
        "depth": 1,
        "left": {
            "val": "*",
            "depth": 2,
            "left": {
                "val": 0.0233754497104266,
                "depth": 3
            },
            "right": {
                "val": 0.0233754497104266,
                "depth": 3
            }
        },
        "right": {
            "val": "+",
            "depth": 2,
            "left": {
                "val": "*",
                "depth": 3,
                "left": {
                    "val": "+",
                    "depth": 4,
                    "left": {
                        "val": "*",
                        "depth": 5,
                        "left": {
                            "val": "*",
                            "depth": 6,
                            "left": {
                                "val": "0",
                                "depth": 7
                            },
                            "right": {
                                "val": -0.11906005301219014,
                                "depth": 7
                            }
                        },
                        "right": {
                            "val": "*",
                            "depth": 6,
                            "left": {
                                "val": "0",
                                "depth": 7
                            },
                            "right": {
                                "val": 0.9827389341777375,
                                "depth": 7
                            }
                        }
                    },
                    "right": {
                        "val": "+",
                        "depth": 5,
                        "left": {
                            "val": "*",
                            "depth": 6,
                            "left": {
                                "val": 0.6447922490927336,
                                "depth": 7
                            },
                            "right": {
                                "val": 0.9533287547408129,
                                "depth": 7
                            }
                        },
                        "right": {
                            "val": 0.0233754497104266,
                            "depth": 6
                        }
                    }
                },
                "right": {
                    "val": "*",
                    "depth": 4,
                    "left": {
                        "val": 0.0233754497104266,
                        "depth": 5
                    },
                    "right": {
                        "val": "*",
                        "depth": 5,
                        "left": {
                            "val": 0.1516549531452891,
                            "depth": 6
                        },
                        "right": {
                            "val": 0.0233754497104266,
                            "depth": 6
                        }
                    }
                }
            },
            "right": {
                "val": "+",
                "depth": 3,
                "left": {
                    "val": "*",
                    "depth": 4,
                    "left": {
                        "val": "*",
                        "depth": 5,
                        "left": {
                            "val": 0.959050623224686,
                            "depth": 6
                        },
                        "right": {
                            "val": "0",
                            "depth": 6
                        }
                    },
                    "right": {
                        "val": "0",
                        "depth": 5
                    }
                },
                "right": {
                    "val": 0.0233754497104266,
                    "depth": 4
                }
            }
        }
    },
    "right": {
        "val": "*",
        "depth": 1,
        "left": {
            "val": 0.959050623224686,
            "depth": 2
        },
        "right": {
            "val": "0",
            "depth": 2
        }
    }
}

/**
 * 
 * @param {typeof t} tn
 */
function tt (tn) {
    if (tn.left && tn.right) {
        return `(${tt(tn.left)} ${tn.val} ${tt(tn.right)})`;
    } else if (tn.left) {
        if (tn.val === '¬') 
            return 'sqrt(abs(' + tt(tn.left)+'))';
        else
            return 'tan(' + tt(tn.left)+')';
    }
    else return typeof tn.val === 'string' ? 'X_'+tn.val : tn.val;
}

console.log(tt(t));
