import { Optional, Model, Sequelize, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import {User} from './user.model';
import {Transaction} from './transaction.model';
import { Product } from './product.model';
import { Question } from './question.model';

export interface NotificationAttributes {
    id: number;
    UserId: number;
    notificationType: string;
    TransactionId?: number;
    ProductId?: number;
    QuestionId?: number;
    status?: string;
    contactEmail?: string;
}

// tells sequelize that todoItemId is not a required field
export interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id'> { }


export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
    id: number;
    UserId!: number;
    notificationType!: string;
    TransactionId!: number;
    ProductId!: number;
    QuestionId!: number;
    status!: string;
    contactEmail!: string;

    // public getPhotos!: HasManyGetAssociationsMixin<Photo>;

    public static initialize(sequelize: Sequelize) { // definition for database
        Notification.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            UserId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            notificationType: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [[
                        'buyerNotification',
                        'sellerNotification',
                        'pendingNotification',
                        'approvalNotification',
                        'rejectionNotification',
                        'questionNotification',
                        'answerNotification'
                    ]],
                }
            },
            TransactionId: {
                type: DataTypes.INTEGER,
            },
            ProductId: {
                type: DataTypes.INTEGER,
            },
            QuestionId: {
                type: DataTypes.INTEGER,
            },
            contactEmail: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'new',
                validate: {
                    isIn: [['new', 'seen']],
                }
            },
        },
        { sequelize, tableName: 'notifications' }
        );
    }

    public static createAssociations() {
        Notification.belongsTo(User, {
            foreignKey: 'UserId'
        });
        User.hasMany(Notification);
        Notification.belongsTo(Transaction, {
            foreignKey: 'TransactionId'
        });
        Transaction.hasMany(Notification);
        Notification.belongsTo(Product, {
            foreignKey: 'ProductId'
        });
        Product.hasOne(Notification);
        Notification.belongsTo(Question, {
            foreignKey: 'QuestionId'
        });
        Question.hasOne(Notification);
    }

}
